// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
// Importaremos el modelo User, bcryptjs y jsonwebtoken más adelante

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    // Lógica para el login irá aquí
    try {
        const { email, password } = req.body;

        // TODO:
        // 1. Validar que email y password vengan en el body
        // 2. Buscar usuario por email en la BD (usando el modelo User de Sequelize)
        // 3. Si no existe el usuario, o !user.is_active, devolver error 401/404
        // 4. Comparar la contraseña enviada con user.password_hash usando bcryptjs.compare()
        // 5. Si la contraseña no coincide, devolver error 401
        // 6. Si todo es correcto, generar un JWT
        // 7. Devolver el JWT y quizás algunos datos del usuario

        res.status(501).json({ message: 'Login endpoint no implementado aún.' }); // 501 Not Implemented

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor al intentar iniciar sesión.' });
    }
};

// Podríamos añadir aquí registerUser, etc. más tarde