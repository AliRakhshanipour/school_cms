import { DataTypes, Model } from "sequelize";

/**
 * Represents a student in the system.
 */
class Student extends Model {
    /**
     * Associate the Student model with other models.
     * 
     * @param {Object} models - The database models.
     */
    static associate(models) {
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

/**
 * Initializes the Student model.
 * 
 * @param {Object} sequelize - The Sequelize instance.
 * @returns {Model} - The Student model.
 */
export const initStudent = (sequelize) => {
    return Student.init({
        /**
         * Unique identifier for the student.
         */
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        /**
         * The first name of the student.
         */
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        /**
         * The last name of the student.
         */
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * The national code of the student.
         */
        national_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * The name of the student's father.
         */
        fatehr_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * The job of the student's father.
         */
        fatehr_job: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * The job of the student's mother.
         */
        mother_job: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * The education level of the student's father.
         */
        father_education: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["diplom", "bachelor", "master", "phd", "others"]
        },
        /**
         * The education level of the student's mother.
         */
        mother_education: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["diplom", "bachelor", "master", "phd", "others"]
        },
        /**
         * The math grade of the student.
         */
        math_grade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        /**
         * The average grade of the student.
         */
        avg_grade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * The discipline grade of the student.
         */
        discipline_grade: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        /**
         * The Sequelize instance.
         */
        sequelize,
        /**
         * The name of the model.
         */
        modelName: "Student",
        /**
         * The name of the table.
         */
        tableName: "students"
    });
};
