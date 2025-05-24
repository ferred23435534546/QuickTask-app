// backend/src/models/Profile.ts
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import sequelizeConnection from '../config/database'; // Tu instancia de Sequelize
import User from './User'; // Importamos el modelo User para la asociación

// Atributos que tiene un perfil (basado en tu migración)
export interface ProfileAttributes {
    profile_id: number;
    user_id: number; // Clave foránea que referencia a User
    description?: string | null;
    location_zone?: string | null;
    phone_number?: string | null;
    profile_picture_url?: string | null;
    avg_rating?: number | null;
    rating_count?: number | null;
    last_seen?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Atributos para la creación de un Profile.
export interface ProfileCreationAttributes extends Optional<ProfileAttributes, 
    'profile_id' | 'description' | 'location_zone' | 'phone_number' | 
    'profile_picture_url' | 'avg_rating' | 'rating_count' | 'last_seen' | 
    'createdAt' | 'updatedAt'> {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
    public profile_id!: number;
    public user_id!: number;
    public description!: string | null;
    public location_zone!: string | null;
    public phone_number!: string | null;
    public profile_picture_url!: string | null;
    public avg_rating!: number | null;
    public rating_count!: number | null;
    public last_seen!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Propiedad para la asociación (opcional, para tipado con eager loading)
    public readonly user?: User;

    // Método para definir asociaciones
    public static associate(models: any): void {
        Profile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    }
}

Profile.init({
    profile_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location_zone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_picture_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avg_rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
    },
    rating_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    last_seen: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: sequelizeConnection,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true
});

export default Profile;