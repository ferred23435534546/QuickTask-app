// backend/src/models/User.ts
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
// Importa la conexión a la base de datos que configuramos antes
import sequelizeConnection from '../config/database';
import Profile from './Profile';

// Define los atributos del modelo User (corresponden a las columnas de la tabla)
export interface UserAttributes {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'client' | 'worker' | 'both' | 'admin';
  is_active: boolean;
  phone?: string | null; // <-- ADDED J
  location?: string | null; // <-- ADDED J
  createdAt?: Date; // Añadido por Sequelize, es opcional en la interfaz
  updatedAt?: Date; // Añadido por Sequelize, es opcional en la interfaz
}

// Define qué atributos son opcionales al crear un nuevo usuario
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'is_active' | 'role' | 'createdAt' | 'updatedAt'> { }

// Define la clase del Modelo extendiendo Model de Sequelize
// Le pasamos los atributos definidos en la interfaz
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public name!: string;
  public role!: 'client' | 'worker';
  public phone!: string | null; // <-- ADDED J
  public location!: string | null; // <-- ADDED J
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Definición de la asociación (puedes tener esta propiedad si usas eager loading)
  public readonly profile?: Profile; // Opcional, para cuando incluyes el perfil

  // --- 2. AÑADE ESTE MÉTODO DE ASOCIACIÓN ---
  public static associate(models: any): void {
    // Un usuario tiene un perfil
    User.hasOne(models.Profile, {
      foreignKey: 'user_id',
      as: 'profile' // Alias para la asociación
    });
    // Un usuario tiene muchas tareas
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks'
    });
  }
}
// Inicializa el modelo User
User.init(
  {
    // Define las columnas de la tabla 'users'
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // Clave primaria
    },
    email: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: false, // No puede ser nulo
      unique: true, // Debe ser único
      validate: {
        isEmail: true, // Validación básica de formato email
      },
    },
    phone: { // <-- ADDED J
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: { // <-- ADDED J
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('client', 'worker', 'both', 'admin'), // Tipo ENUM con los roles permitidos
      allowNull: false,
      defaultValue: 'client', // Valor por defecto si no se especifica
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Los usuarios están activos por defecto
    },
    // createdAt y updatedAt son gestionados automáticamente por Sequelize
  },
  {
    // Opciones adicionales del modelo
    sequelize: sequelizeConnection, // Pasa la conexión Sequelize que configuramos
    modelName: 'User', // Nombre del modelo (singular)
    tableName: 'users', // Nombre de la tabla en la base de datos (plural, por convención)
    timestamps: true, // Habilita createdAt y updatedAt automáticamente
    // underscored: true, // Opcional: si quieres que los nombres de columna sean snake_case (user_id) en lugar de camelCase (userId)
  }
);

// Exporta el modelo para poder usarlo en otros archivos (ej. controladores, servicios)
export default User;
