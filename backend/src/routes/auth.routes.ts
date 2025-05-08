// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { loginUser } from '../controllers/auth.controller'; // Importamos la función del controlador

const router = Router();

// Definimos la ruta POST para /login
// Cuando llegue una petición POST a /api/auth/login (el prefijo /api/auth lo definiremos en server.ts)
// se ejecutará la función loginUser del auth.controller
router.post('/login', loginUser);

// Podríamos añadir aquí router.post('/register', registerUser); más tarde

export default router;