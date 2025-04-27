// backend/src/server.ts
import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import sequelizeConnection, { testDbConnection } from './config/database'; // Importa la conexión

// Carga las variables de entorno desde .env
// dotenv.config(); // Ya no es necesario aquí si se carga en database.ts

const app: Application = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola desde el Backend de QuickTask!');
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // 1. Probar la conexión a la base de datos ANTES de iniciar el servidor
    await testDbConnection();

    // (Opcional) Sincronizar modelos con la base de datos
    // ¡CUIDADO! { force: true } BORRA y recrea las tablas. Usar solo en desarrollo inicial.
    // await sequelizeConnection.sync({ force: false }); // { alter: true } intenta modificar tablas existentes
    // console.log('Database synchronized.'); // Descomentar si usas sync

    // 2. Iniciar el servidor Express si la conexión a la BBDD es exitosa
    app.listen(port, () => {
      console.log(`✅ Servidor backend escuchando en el puerto ${port}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Termina si no puede conectar a la BBDD o sincronizar
  }
};

// Llama a la función para iniciar el servidor
startServer();
