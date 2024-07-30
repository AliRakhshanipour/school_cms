import { DataTypes, Model } from "sequelize";

/**
 * Room Model represents the rooms in your application.
 */
class Room extends Model {
    /**
     * Associate Room with other models.
     * @param {object} models - The Sequelize models object.
     */
    static associate(models) {
        // Define associations here if needed in the future
    }
}

/**
 * Initialize the Room model.
 * 
 * @param {object} sequelize - The Sequelize instance.
 * @returns  The Room model.
 */
export const initRoom = (sequelize) => {
    Room.init({
        /**
         * Unique identifier for each room.
         */
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        /**
         * Title or name of the room.
         */
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /**
         * Unique room number.
         */
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                args: true,
                msg: "This room number already exists"
            }
        }
    }, {
        sequelize,
        modelName: 'Room',
        tableName: 'rooms'
    });

    return Room;
}
