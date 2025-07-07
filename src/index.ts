import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import loginRouter from './routers/login.route.ts'
import registerRouter from './routers/register.route.ts'
import { refreshRouter } from './routers/refresh.route.ts'
import { cors } from 'hono/cors'
import { protectedRoute } from './routers/protected.route.ts'
import { deleteCookie } from 'hono/cookie'

const app = new Hono()

app.use(
  cors(
    {
      origin: '*',
    }
  )
)

app.route('/api/login', loginRouter)
app.route('/api/register', registerRouter)
app.route('/api/protected', protectedRoute)
app.route('/api/refresh', refreshRouter)

app.post('/api/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/' });
  // Asegúrate de que el 'path' coincida con el path con el que se estableció la cookie
  return c.json({
    message: 'Sesión cerrada exitosamente',
    success: true
  });
});


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
