import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, userLogin } from '../controllers/user/user-login.ts';
const loginRouter = new Hono();
loginRouter.post('/', zValidator('json', loginSchema), userLogin);
export default loginRouter;
