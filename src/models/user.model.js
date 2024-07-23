import { DataTypes, Model, Op } from 'sequelize';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Number of rounds for hashing

// Define the valid roles as a constant array
const VALID_ROLES = ["admin", "user", "guest"];

class User extends Model {
    static associate(models) {
        User.hasMany(models.Image, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }

    // Instance method to compare passwords
    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }


    // Static method to get ENUM values for role
    static getRoleEnumValues() {
        return VALID_ROLES;
    }
}

// Initialize the model with attributes and options
export const initUser = (sequelize) => {
    return User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "username already exists"
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "email already exists"
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "phone number already exists"
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM,
            values: VALID_ROLES,
            defaultValue: "guest",
            validate: {
                isIn: [VALID_ROLES],
            },
        },
        isSuperuser: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        activity: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
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
};
