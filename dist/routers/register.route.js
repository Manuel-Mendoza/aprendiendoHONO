import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userRegister, registerSchema } from '../controllers/user/user-register.ts';
const registerRouter = new Hono();
registerRouter.post('/', zValidator('json', registerSchema), userRegister);
export default registerRouter;
