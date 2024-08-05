import { DataTypes, Model } from 'sequelize';

class Attendance extends Model {
  static associate(models) {
    Attendance.belongsTo(models.Student, {
      foreignKey: 'studentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Attendance.belongsTo(models.Session, {
      foreignKey: 'sessionId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export const initAttendance = (sequelize) => {
  Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Attendance',
      tableName: 'attendances',
      timestamps: true,
    }
  );

  return Attendance;
};
