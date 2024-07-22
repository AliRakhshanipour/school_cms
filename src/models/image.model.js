import { DataTypes, Model } from "sequelize";

class Image extends Model {
    static associate(models) {
        Image.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        })
    }
}

export const initImage = (sequelize) => {
    Image.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "Image",
        tableName: "images"
    })

    return Image;
}
