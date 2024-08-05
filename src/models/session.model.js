import { DataTypes, Model } from 'sequelize';

/**
 * Represents a session in a room.
 *
 * @extends Model
 */
class Session extends Model {
  /**
   * Defines associations for the Session model.
   *
   * @param {Object} models - The object containing all models.
   */
  static associate(models) {
    // Define a belongs-to relationship with the Class model
    Session.belongsTo(models.Room, {
      foreignKey: 'roomId',
      onDelete: 'SET NULL', // Set roomId to null if the class is deleted
      onUpdate: 'CASCADE', // Update classId if the referenced class is updated
    });
    // Define a belongs-to relationship with the Class model
    Session.belongsTo(models.Class, {
      foreignKey: 'classId',
      onDelete: 'SET NULL', // Set classId to null if the class is deleted
      onUpdate: 'CASCADE', // Update classId if the referenced class is updated
    });

    // Optionally, define a belongs-to relationship with a Teacher model if you have one
    Session.belongsTo(models.Teacher, {
      foreignKey: 'teacherId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Session.hasMany(models.Attendance, {
      foreignKey: 'sessionId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

/**
 * Initializes the Session model.
 *
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance to connect with the database.
 * @returns {typeof Session} - The initialized Session model.
 */
export const initSession = (sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.ENUM(
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday'
        ),
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'classes',
          key: 'id',
        },
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'teachers', // Optionally, ensure you have a 'teachers' model
          key: 'id',
        },
      },
      lesson: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: false, // Disable timestamps if not needed
    }
  );

  return Session;
};
