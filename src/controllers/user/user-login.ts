import type { Context } from "hono"
import { db } from "../../db/index.ts"
import { usersTable } from "../../db/schemas/user.schema.ts"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from 'zod'
import { sign } from 'hono/jwt'
import {
    setCookie,
} from 'hono/cookie'

// 2. Validar los datos del Usuario
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    })
})

export const userLogin = async (c: Context) => {
    // 1. Obtener los datos del Usuario desde el Body
    const body = await c.req.json()

    // Aplicar typado
    const { email, password } = loginSchema.parse(body)

    // 3. Verificar que el Usuario exista en la Base de Datos
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))

    if (!user) {
        return c.json({ message: 'Invalid credentials' }, 401)
    }
    
    // 4. Verificar si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return c.json({ message: 'Invalid credentials' }, 401)
    }

    // 5. Si la contraseña es correcta, retornar un mensaje de éxito y el token
    // Generar access token (1h de duración)
    const accessToken = await sign(
        { id: user.id, email: user.email, exp: 3600 },
        process.env.JWT_SECRET!,
        'HS256'
    )
    
    // Generar refresh token (7 días de duración)
    const refreshToken = await sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        'HS256'
    )

    // Establecer cookies
    setCookie(c, 'auth_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 3600
    })

    setCookie(c, 'refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 604800 // 7 días
    })

    return c.json({
        message: 'User Login!',
    })
}
