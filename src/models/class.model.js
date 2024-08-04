import { DataTypes, Model } from 'sequelize';
import { models } from './index.js';

/**
 * Represents a class in the system.
 *
 * @extends Model
 */
class Class extends Model {
  /**
   * Defines associations for the Class model.
   *
   * @param {Object} models - The object containing all models.
   */
  static associate(models) {
    // Define one-to-many relationship between Class and Student
    Class.hasMany(models.Student, {
      foreignKey: 'classId',
      onDelete: 'SET NULL', // Set classId to null if the class is deleted
      onUpdate: 'CASCADE', // Update classId if the referenced class is updated
    });

    Class.hasMany(models.Session, {
      foreignKey: 'classId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  /**
   * Checks if a class has reached its capacity.
   *
   * @param {number} classId - The ID of the class to check.
   * @returns {Promise<boolean>} - True if the class has reached its capacity, false otherwise.
   * @throws {Error} - Throws an error if the class is not found.
   */
  static async isClassFull(classId) {
    // Fetch the class instance by its primary key
    const classInstance = await this.findByPk(classId);
    if (!classInstance) {
      throw new Error('Class not found');
    }

    // Count the number of students associated with the class
    const studentCount = await models.Student.count({ where: { classId } });

    // Return true if the student count is equal to or exceeds the class capacity
    return studentCount >= classInstance.capacity;
  }
}

/**
 * Initializes the Class model.
 *
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance to connect with the database.
 * @returns {typeof Class} - The initialized Class model.
 */
export const initClass = (sequelize) => {
  Class.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'This class title already exists.',
        },
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args: true,
          msg: 'This class number already exists.',
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Class',
      tableName: 'classes',
      timestamps: false, // Disable timestamps if not needed
    }
  );

  return Class;
};
