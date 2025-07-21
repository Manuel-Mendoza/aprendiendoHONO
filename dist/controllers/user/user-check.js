import { verify } from "hono/jwt";
// Middleware
export const userIsLogin = async (c, next) => {
    const tokenHeader = c.req.header("Authorization");
    if (!tokenHeader) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const token = tokenHeader.split(" ")[1];
    let payload;
    try {
        const payloadBueno = await verify(token, process.env.JWT_SECRET);
        payload = payloadBueno;
    }
    catch {
        return c.json({ message: "error" }, 401);
    }
    c.set("user", payload);
    next();
};
// Controller
export const userGet = async (c) => {
    const user = c.get("user");
    return c.json({
        message: "User is logged in",
        user
    });
};
