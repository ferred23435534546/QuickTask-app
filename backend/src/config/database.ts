// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env en la raíz del backend
dotenv.config({ path: '../.env' }); // <-- CORREGIDO: Ruta un nivel arriba desde /config

// Lee las variables de entorno para la conexión
const dbName = process.env.DB_NAME as string; // <-- CORREGIDO: Usar DB_NAME
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

// Verifica que las variables críticas existen
if (!dbName || !dbUser || !dbHost || dbPassword === undefined) {
  console.error('Error: Database environment variables are not set properly in backend/.env');
  console.error(`DB_NAME: ${dbName}, DB_USER: ${dbUser}, DB_HOST: ${dbHost}, DB_PASSWORD: ${dbPassword ? '***' : undefined}`);
  process.exit(1);
}

// Crea la instancia de Sequelize
const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  port: 3306,
  // logging: console.log, // Descomenta para depurar SQL
  logging: false, // Mejor desactivado para no llenar la consola
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función asíncrona para probar la conexión (sin cambios)
export const testDbConnection = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('✅ Connection to database has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    // throw error; // Quizás relanzar el error para que startServer lo capture
  }
};

// Exporta la conexión (sin cambios)
export default sequelizeConnection;