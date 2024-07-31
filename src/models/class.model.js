import { DataTypes, Model } from "sequelize";

class Class extends Model {
    static associate(models) {
        // Associate Class with Student
        Class.hasMany(models.Student, {
            foreignKey: 'classId',
            onDelete: 'SET NULL', // Ensure students' classId is set to null if a class is deleted
            onUpdate: 'CASCADE'  // Automatically update classId if it's updated
        });
    }
}

export const initClass = (sequelize) => {
    Class.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'this class title already exists'
            }
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                args: true,
                msg: 'this class number already exists'
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Class',
        tableName: 'classes'
    })

    return Class;
}