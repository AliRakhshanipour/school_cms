import { DataTypes, Model } from 'sequelize';

class Session extends Model {
    static associate(models) {
        Session.belongsTo(models.Class, {
            foreignKey: 'classId',
            onDelete: 'CASCADE',
        });
        Session.belongsTo(models.Teacher, {
            foreignKey: 'teacherId',
            onDelete: 'CASCADE',
        });
    }
}

export const initSession = (sequelize) => {
    return Session.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        teacherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Session',
        tableName: 'sessions',
    });
};
