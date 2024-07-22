import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Number of rounds for hashing

class User extends Model {
    // Instance method to compare passwords
    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

// Initialize the model with attributes and options
export const initUser = (sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
            beforeCreate: async (user, options) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
                }
            },
            beforeUpdate: async (user, options) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
                }
            },
        },
    });

    return User;
};
