import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import loginRouter from './routers/login.route.js';
import registerRouter from './routers/register.route.js';
import { cors } from 'hono/cors';
import { userCheckRouter } from './routers/userCheck.route.js';
const app = new Hono();
app.use(cors({
    origin: '*',
}));
app.route('/api/login', loginRouter);
app.route('/api/register', registerRouter);
app.route('/api/user', userCheckRouter);
serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
