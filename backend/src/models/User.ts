// backend/src/models/User.ts
import { Model, DataTypes, Sequelize } from 'sequelize';
// Importa la conexión a la base de datos que configuramos antes
import sequelizeConnection from '../config/database';

// Define los atributos del modelo User (corresponden a las columnas de la tabla)
export interface UserAttributes {
  id: number;
  email: string;
  password_hash: string; // Guardaremos el hash de la contraseña, no la contraseña en texto plano
  name: string;
  role: 'client' | 'worker' | 'both' | 'admin'; // Roles definidos
  is_active: boolean;
  // createdAt y updatedAt se añadirán automáticamente por Sequelize si timestamps=true
}

// Define la clase del Modelo extendiendo Model de Sequelize
// Le pasamos los atributos definidos en la interfaz
class User extends Model<UserAttributes> implements UserAttributes {
  // Definición explícita de los atributos públicos de la clase
  // (Necesario para que TypeScript los reconozca)
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public name!: string;
  public role!: 'client' | 'worker' | 'both' | 'admin';
  public is_active!: boolean;

  // Timestamps automáticos (opcional pero recomendado)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Aquí podrías añadir métodos personalizados para el modelo User si los necesitas
  // Por ejemplo, un método para comparar contraseñas:
  // public async comparePassword(password: string): Promise<boolean> {
  //   // Necesitarías importar bcryptjs aquí
  //   // return bcrypt.compare(password, this.password_hash);
  // }
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
