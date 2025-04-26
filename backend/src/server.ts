// backend/src/server.ts
import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

// Carga las variables de entorno desde .env
dotenv.config();

const app: Application = express();
// Usa el puerto definido en .env o 3000 por defecto
const port = process.env.PORT || 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Ruta de prueba simple
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola desde el Backend de QuickTask!');
});

// Iniciar el servidor
app.listen(port, () => {
  // Mensaje para saber que el servidor arrancó (se verá en los logs de Docker)
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});