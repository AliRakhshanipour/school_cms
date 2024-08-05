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

const ATTENDANCE_STATUS = ['present', 'delay', 'absent'];

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
      status: {
        type: DataTypes.ENUM,
        values: ATTENDANCE_STATUS,
        validate: {
          isIn: {
            args: [ATTENDANCE_STATUS],
            msg: `status must be one of 'present' , 'delay' , 'absent'`,
          },
        },
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
