import { Model, DataTypes, Optional } from 'sequelize';
import sequelizeConnection from '../config/database';
import User from './User';

export interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  urgency: string;
  requirements?: string | null;
  dateNeeded: string;
  status: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'requirements' | 'createdAt' | 'updatedAt'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public location!: string;
  public budget!: number;
  public urgency!: string;
  public requirements!: string | null;
  public dateNeeded!: string;
  public status!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  urgency: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dateNeeded: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: sequelizeConnection,
  modelName: 'Task',
  tableName: 'tasks',
  timestamps: true,
});

// Asociación: cada tarea pertenece a un usuario
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Task; 