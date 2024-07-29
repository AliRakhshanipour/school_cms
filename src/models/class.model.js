import { DataTypes, Model } from 'sequelize';

class Class extends Model {
    static associate(models) {
        Class.hasMany(models.Session, {
            foreignKey: 'classId',
            onDelete: 'CASCADE',
        });
        Class.hasMany(models.Student, {
            foreignKey: 'classId',
            onDelete: 'CASCADE',
        });
        Class.hasOne(models.Field, {
            foreignKey: 'fieldId',
            onDelete: 'CASCADE'
        })
    }
}

export const initClass = (sequelize) => {
    return Class.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fieldId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Class',
        tableName: 'classes',
    });
};
