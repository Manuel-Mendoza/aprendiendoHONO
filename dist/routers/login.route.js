import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, userLogin } from '@/controllers/user/user-login';
const loginRouter = new Hono();
loginRouter.post('/', zValidator('json', loginSchema), userLogin);
export default loginRouter;
