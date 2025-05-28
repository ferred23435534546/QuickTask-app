import { Sequelize } from 'sequelize';
import sequelizeConnection from '../config/database'; // Importa la conexión

const db: any = {};

db.sequelize = sequelizeConnection;
db.Sequelize = Sequelize;

// Importa los modelos
db.User = require('./User').default;
db.Profile = require('./Profile').default;
db.Task = require('./Task').default;

// --- Define las asociaciones AQUÍ ---
db.User.associate(db);
db.Profile.associate(db);
db.Task.associate(db);

export default db;