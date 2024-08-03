import { DataTypes, Model } from 'sequelize';

class Teacher extends Model {
  static associate(models) {
    // Association with the Image model
    Teacher.hasOne(models.Image, {
      foreignKey: 'imageableId',
      as: 'teacherPicture',
      constraints: false,
      scope: {
        imageableType: 'teacher',
      },
    });

    Teacher.hasMany(models.Session, {
      foreignKey: 'teacherId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
}

export const initTeacher = (sequelize) => {
  return Teacher.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'First name cannot be empty',
          },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Last name cannot be empty',
          },
        },
      },
      personal_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Personal code already exists',
        },
        validate: {
          notEmpty: {
            msg: 'Personal code cannot be empty',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Phone number already exists',
        },
        validate: {
          is: {
            args: /^[0-9]+$/,
            msg: 'Phone number must contain only digits',
          },
          notEmpty: {
            msg: 'Phone number cannot be empty',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            msg: 'Must be a valid email address',
          },
        },
      },
      hire_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'Must be a valid date',
          },
          notEmpty: {
            msg: 'Hire date cannot be empty',
          },
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      subject_specialization: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: 'Subject specialization cannot be empty',
          },
        },
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'Must be a valid date',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Teacher',
      tableName: 'teachers',
      timestamps: true, // Enable timestamps for createdAt and updatedAt
    }
  );
};
