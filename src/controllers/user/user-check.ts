import type { Context, Next } from "hono"
import { verify } from "hono/jwt"

// Middleware
export const userIsLogin = async (c: Context, next: Next) => {
    const tokenHeader = c.req.header("Authorization");
    if (!tokenHeader) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const token = tokenHeader.split(" ")[1];
    const payload = await verify(token, process.env.JWT_SECRET!);
    c.set("user", payload);
    next()
}

// Controller
export const userGet = async (c: Context) => {
    const user = c.get("user");
    return c.json({
        message: "User is logged in",
        user
    })
}
