import type { Context } from "hono"
import { db } from "../../db/index.ts"
import { usersTable } from "../../db/schemas/user.schema.ts"
import { eq } from "drizzle-orm"
import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie } from 'hono/cookie'

interface TokenPayload {
    id: number
    email: string
    exp?: number
    [key: string]: unknown
}

export const userRefresh = async (c: Context) => {
    // 1. Obtener refresh token de las cookies
    const refreshToken = getCookie(c, 'refresh_token')

    if (!refreshToken) {
        return c.json({ error: 'Unauthorized: No refresh token provided' }, 401)
    }

    // 2. Verificar refresh token
    try {
        const payload = await verify(refreshToken, process.env.JWT_SECRET!)
        if (!payload.id || !payload.email) {
            return c.json({ error: 'Invalid token payload' }, 401)
        }
        const userId = Number(payload.id)
        if (isNaN(userId)) {
            return c.json({ error: 'Invalid user ID in token' }, 401)
        }
        
        // 3. Buscar usuario en la base de datos
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId))

        if (!user) {
            return c.json({ error: 'User not found' }, 404)
        }

        // 4. Generar nuevo access token
        const newAccessToken = await sign(
            { id: user.id, email: user.email, exp: 3600 }, // 1h
            process.env.JWT_SECRET!,
            'HS256'
        )

        // 5. Establecer nuevo access token en cookies
        setCookie(c, 'auth_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            maxAge: 3600
        })

        return c.json({ 
            message: 'Token refreshed successfully',
            access_token: newAccessToken
        })

    } catch (err) {
        console.error("Refresh token validation error:", err)
        return c.json({ error: 'Unauthorized: Invalid or expired refresh token' }, 401)
    }
}
