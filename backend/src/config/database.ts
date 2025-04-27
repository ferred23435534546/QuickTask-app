// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config({ path: '../../.env' }); // Ajusta la ruta si tu .env está en otro lugar relativo

// Lee las variables de entorno para la conexión
const dbName = process.env.DB_DATABASE as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST; // El nombre del servicio 'db' en docker-compose
const dbPassword = process.env.DB_PASSWORD;

if (!dbName || !dbUser || !dbHost || dbPassword === undefined) {
  console.error('Error: Database environment variables are not set properly.');
  process.exit(1); // Termina la aplicación si faltan variables críticas
}

// Crea la instancia de Sequelize
const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql', // Especifica que estamos usando MySQL
  port: 3306,       // Puerto por defecto de MySQL
  logging: console.log, // Muestra las consultas SQL en la consola (útil para depurar)
  // logging: false, // Desactiva el logging en producción
  pool: { // Configuración del pool de conexiones (opcional pero recomendado)
    max: 5, // Máximo de conexiones abiertas
    min: 0, // Mínimo de conexiones abiertas
    acquire: 30000, // Tiempo máximo (ms) para intentar obtener una conexión
    idle: 10000 // Tiempo máximo (ms) que una conexión puede estar inactiva antes de cerrarse
  }
});

// Función asíncrona para probar la conexión
export const testDbConnection = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('✅ Connection to database has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    // Podrías querer terminar la aplicación si no puede conectar a la BBDD al inicio
    // process.exit(1);
  }
};

// Exporta la conexión para usarla en otros lugares (modelos, etc.)
export default sequelizeConnection;
