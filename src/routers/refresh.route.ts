import { Hono } from 'hono'
import { userRefresh } from '../controllers/user/user-refresh.ts'

const refreshRouter = new Hono()

refreshRouter.post('/', userRefresh)

export { refreshRouter }
