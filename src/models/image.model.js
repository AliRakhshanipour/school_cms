import { DataTypes, Model } from "sequelize";

class Image extends Model {
    static associate(models) {
        Image.belongsTo(models.User, {
            foreignKey: 'imageableId',
            as: 'profilePicture',
            constraints: false
        });

        Image.belongsTo(models.Student, {
            foreignKey: 'imageableId',
            as: 'studentPicture',
            constraints: false
        });

        Image.belongsTo(models.Field, {
            foreignKey: 'imageableId',
            as: 'fieldPicture',
            constraints: false
        });

        Image.belongsTo(models.Teacher, {
            foreignKey: 'imageableId',
            as: 'teacherPicture',
            constraints: false
        });

    }


}

export const initImage = (sequelize) => {
    Image.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageableId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageableType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Image',
        tableName: 'images',
    });

    return Image;
};
