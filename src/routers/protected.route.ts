// protected.route.ts (o como lo llames)
import { Hono } from 'hono'
import {  userProfileController, userProtected } from '../controllers/user/user-protected.ts' // Asegúrate de que esto sea correcto

export const protectedRoute = new Hono()
protectedRoute.use('/', userProtected) // Este middleware ya protege todo aquí dentro

// Ahora, define tus rutas de perfil *dentro* de protectedRoute
// Esto haría que la ruta sea /api/protected/profile
protectedRoute.get('/profile', userProfileController)
