// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz Request de Express para añadir la propiedad 'user'
// Esto es opcional pero ayuda con TypeScript para saber que req.user existe después del middleware.
export interface AuthenticatedRequest extends Request {
  user?: { // Hacemos 'user' opcional por si el token no es válido o no se proporciona
    id: number;
    email: string;
    role: string;
    // Puedes añadir más propiedades que tengas en tu payload del JWT
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization']; // Formato común: Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1]; // Extraemos solo el token

  if (token == null) {
    // Si no hay token, enviamos un error 401 (No Autorizado)
    res.status(401).json({ message: 'Acceso denegado: No se proporcionó token.' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error('Error Crítico en Middleware: JWT_SECRET no está definido.');
    res.status(500).json({ message: 'Error interno del servidor: Configuración de autenticación incorrecta.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, userPayload: any) => {
    if (err) {
      // Si el token no es válido (expirado, malformado, firma incorrecta)
      console.warn('Intento de acceso con token inválido:', err.message);
      res.status(403).json({ message: 'Acceso denegado: Token no válido o expirado.' }); // 403 Prohibido
      return;
    }

    // Si el token es válido, el payload decodificado está en 'userPayload'
    // Lo añadimos al objeto req para que las rutas protegidas puedan acceder a él
    req.user = userPayload as { id: number; email: string; role: string; };
    next(); // Continuamos con la siguiente función en la cadena de middlewares/ruta
  });
};