import { Hono } from 'hono';
import { userIsLogin, userGet } from '@/controllers/user/user-check';
export const userCheckRouter = new Hono();
userCheckRouter.get('/check', userIsLogin, userGet);
