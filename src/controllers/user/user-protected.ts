
import type { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";

interface TokenPayload {
    id: number
    email: string
    exp?: number
    [key: string]: unknown
}

export const userProtected = async (c: Context, next: Next) => {
    // 1. Verificar access token primero
    const accessToken = getCookie(c, 'auth_token');
    
    if (accessToken) {
        try {
            const payload = await verify(accessToken, process.env.JWT_SECRET!) as TokenPayload;
            c.set('user', payload);
            return await next();
        } catch (err) {
            console.log('Access token expired, checking refresh token...');
        }
    }

    // 2. Si access token no existe o es inválido, verificar refresh token
    const refreshToken = getCookie(c, 'refresh_token');
    if (!refreshToken) {
        return c.json({ error: 'Unauthorized: No valid tokens provided' }, 401);
    }

    try {
        // 3. Verificar refresh token
        const payload = await verify(refreshToken, process.env.JWT_SECRET!) as TokenPayload;
        
        // 4. Generar nuevo access token
        const newAccessToken = await sign(
            { id: payload.id, email: payload.email, exp: 3600 },
            process.env.JWT_SECRET!,
            'HS256'
        );

        // 5. Establecer nuevo access token en cookies
        setCookie(c, 'auth_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            maxAge: 3600
        });

        c.set('user', payload);
        return await next();
    } catch (err) {
        console.error("Token validation error:", err);
        return c.json({ error: 'Unauthorized: Invalid or expired tokens' }, 401);
    }
};



export const userProfileController = async (c: Context) => {
    // Asumiendo que userProtected ha adjuntado la información del usuario al contexto
    const user = c.get('user'); // Obtener el usuario autenticado del contexto

    if (!user) {
        // Esto no debería suceder si userProtected funcionó correctamente
        return c.json({ error: 'User data not found in context' }, 500);
    }

    // Aquí, podrías buscar más datos del usuario en tu base de datos si es necesario
    // const fullUserProfile = await db.users.findUnique({ where: { id: user.id } });

    // Por ahora, solo devolvemos lo que tenemos del token
    return c.json({
        message: 'User profile data',
        user: user // Devuelve los datos del usuario del token
    });
};
