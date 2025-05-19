'use strict';


/*Buenas chicos, aquí os voy a dejar varios comandos (un par alomejor) sobre como poder hacer cambios (si es necesario)
dentro de la base de datos.

-docker compose exec backend npx sequelize-cli db:migrate:undo:all --debug 
  Este comando revertirá todas las migraciones que Sequelize haya registrado como aplicadas en tu base de datos. 
  La opción --debug te dará información detallada del proceso. l
-docker compose exec backend npx sequelize-cli db:migrate --debug
  Este comando buscará en tu carpeta de migraciones los archivos que aún no se han aplicado y los ejecutará. Es decir,
  introducirá los campos de nuevas tablas o los cambios en las tablas ya creadas.

*/



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // --- CREACIÓN DE LA TABLA 'users' (CON 'role' COMO STRING) ---
    await queryInterface.createTable('users', {
      id: { // Se mantiene 'id' como nombre original
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: { // 'role' se define directamente como STRING
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'client'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: { // Se mantiene 'createdAt' como nombre original
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: { // Se mantiene 'updatedAt' como nombre original
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // --- CREACIÓN DE NUEVAS TABLAS ---

    // Tabla CATEGORIES
    await queryInterface.createTable('categories', {
      category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      parent_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabla PROFILES
    await queryInterface.createTable('profiles', {
      profile_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location_zone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profile_picture_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      avg_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true
      },
      rating_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      last_seen: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabla JOBS
    await queryInterface.createTable('jobs', {
      job_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      location_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      job_datetime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'open'
      },
      budget_estimation: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      created_at: { // Nombre de columna como lo especificaste en TXT para JOBS
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabla RATINGS
    await queryInterface.createTable('ratings', {
      rating_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rater_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rated_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'jobs',
          key: 'job_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      score: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: { // Nombre de columna como lo especificaste en TXT para RATINGS
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabla MESSAGES
    await queryInterface.createTable('messages', {
      message_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      receiver_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      message_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      sent_at: { // Nombre de columna como lo especificaste en TXT para MESSAGES
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabla WORKERSKILLS (Tabla de unión)
    await queryInterface.createTable('workerskills', {
      worker_user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabla ASSIGNMENTS
    await queryInterface.createTable('assignments', {
      assignment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'jobs',
          key: 'job_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      worker_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'      // Apunta a 'users.id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      assigned_at: { // Nombre de columna como lo especificaste en TXT para ASSIGNMENTS
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir en orden inverso a la creación para respetar las FK
    await queryInterface.dropTable('assignments');
    await queryInterface.dropTable('workerskills');
    await queryInterface.dropTable('messages');
    await queryInterface.dropTable('ratings');
    await queryInterface.dropTable('jobs');
    await queryInterface.dropTable('profiles');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('users'); // Ahora también eliminamos la tabla users
  }
};