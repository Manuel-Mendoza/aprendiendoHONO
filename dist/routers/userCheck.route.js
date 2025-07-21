import { Hono } from 'hono';
import { userIsLogin, userGet } from '../controllers/user/user-check.js';
export const userCheckRouter = new Hono();
userCheckRouter.get('/check', userIsLogin, userGet);
