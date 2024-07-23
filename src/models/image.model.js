import { DataTypes, Model } from "sequelize";

class Image extends Model {
    static associate(models) {
        Image.belongsTo(models.User, {
            foreignKey: 'imageableId',
            as: 'profilePicture',
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
