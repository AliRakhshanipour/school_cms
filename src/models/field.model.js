import { DataTypes, Model } from "sequelize";

/**
 * Field Model represents the fields of study in your application.
 */
class Field extends Model {
    /**
     * Associate Field with Image using a polymorphic association.
     * @param {object} models - The Sequelize models object.
     */
    static associate(models) {
        Field.hasMany(models.Image, {
            foreignKey: 'imageableId',
            as: 'fieldPicture',
            constraints: false,
            scope: {
                imageableType: 'field'
            }
        });

        Field.belongsTo(models.Class, {
            foreignKey: "fieldId",
            onDelete: "CASCADE",
        })
    }
}


export const initField = (sequelize) => {
    Field.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.ENUM,
            values: ['برق ساختمان', 'نصب و تعمیر آسانسور', 'برق صنعتی', 'مکانیک خودرو', 'صنایع چوب و مبلمان'],
            allowNull: false
        },
        short_text: {
            type: DataTypes.STRING,
            allowNull: true
        },
        grade: {
            type: DataTypes.ENUM,
            values: ['دهم', 'یازدهم', 'دوازدهم'],
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fieldId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: "fields",
        modelName: "Field"
    });

    return Field;
}
