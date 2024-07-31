import { DataTypes, Model } from "sequelize";

/**
 * Represents a student in the system.
 */
class Student extends Model {
    static associate(models) {

        // Associate Student with Class
        Student.belongsTo(models.Class, {
            foreignKey: 'classId',
            onDelete: 'SET NULL', // Update this to set classId to null if Class is deleted
            onUpdate: 'CASCADE'  // Automatically update classId if it's updated
        });


        // Associate Student with Image using a polymorphic association
        Student.hasOne(models.Image, {
            foreignKey: 'imageableId',
            as: 'studentPicture',
            constraints: false,
            scope: {
                imageableType: 'student'
            }
        });

    }
}

export const initStudent = (sequelize) => {
    Student.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        national_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fatehr_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fatehr_job: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mother_job: {
            type: DataTypes.STRING,
            allowNull: false
        },
        father_education: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["diplom", "bachelor", "master", "phd", "others"]
        },
        mother_education: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["diplom", "bachelor", "master", "phd", "others"]
        },
        math_grade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avg_grade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discipline_grade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "Student",
        tableName: "students"
    });
    return Student;
};
