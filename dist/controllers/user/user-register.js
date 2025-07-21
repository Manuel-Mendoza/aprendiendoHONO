import { db } from "../../db/index.ts";
import { usersTable } from "../../db/schemas/user.schema.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from 'zod';
// 2. Validar los datos del Usuario
export const registerSchema = z.object({
    username: z.string().trim().toLowerCase().min(3, {
        message: 'Username must be at least 3 characters long'
    }).optional(),
    email: z.string().trim().toLowerCase().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    })
});
export const userRegister = async (c) => {
    // 1. Obtener los datos del Usuario desde el Body
    const body = await c.req.json();
    const { email, password, username } = registerSchema.parse(body);
    // 3. Verificar que el Usuario no exista en la Base de Datos
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    if (user) {
        return c.json({ message: 'User already exists' }, 400);
    }
    // 4. Hacer hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // 5. Crear el Usuario en la Base de Datos
    const [newUser] = await db.insert(usersTable).values({
        email,
        password: hashedPassword,
        username: username || email.split('@')[0]
    }).returning({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username
    });
    // 6. Retornar un mensaje de éxito
    return c.json({
        message: 'User registered successfully',
        newUser
    });
};
