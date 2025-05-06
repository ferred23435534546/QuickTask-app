'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Función UP: Define lo que hace la migración al aplicarse
  async up(queryInterface, Sequelize) { // 'Sequelize' con S mayúscula
    await queryInterface.createTable('users', { // Nombre de tabla 'users' en minúscula
      // Columna 'id' (PK, AutoIncrement) - Reemplaza user_id por convención
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER // Tipo INT
      },
      // Columna 'email' (VARCHAR, Único, No Nulo)
      email: {
        type: Sequelize.STRING, // STRING en Sequelize -> VARCHAR(255) por defecto
        allowNull: false,
        unique: true
      },
      // Columna 'password_hash' (VARCHAR, No Nulo)
      password_hash: {
        type: Sequelize.STRING, // Suficiente para hashes bcrypt
        allowNull: false
      },
      // Columna 'name' (VARCHAR, No Nulo)
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Columna 'role' (ENUM o STRING, No Nulo) - Usamos ENUM basado en tu código
      role: {
        type: Sequelize.ENUM('client', 'worker', 'both', 'admin'),
        allowNull: false,
        defaultValue: 'client' // Valor por defecto como en tu código
      },
       // Columna 'is_active' (BOOLEAN, No Nulo)
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true // Valor por defecto como en tu código
      },
       // Columna 'createdAt' (DATETIME, No Nulo) - Estándar de Sequelize
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // Columna 'updatedAt' (DATETIME, No Nulo) - Estándar de Sequelize (añadida)
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  // Función DOWN: Define cómo revertir la migración
  async down(queryInterface, Sequelize) { // 'Sequelize' con S mayúscula
    // Borra la tabla 'users' (minúscula)
    await queryInterface.dropTable('users');
  }
};