// backend/config/config.json

// Carga las variables de entorno desde backend/.env
// La ruta es relativa desde donde se ejecuta sequelize-cli usualmente
require('dotenv').config({ path: '../.env' });

module.exports = {
  // Usaremos la configuración 'development' por ahora
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  // Puedes dejar las configuraciones 'test' y 'production'
  // o configurarlas de manera similar si las necesitas más adelante
  test: {
    // ...configuración para entorno de pruebas...
  },
  production: {
   // ...configuración para entorno de producción...
  }
};