import { sequelize } from "../configs/database.conf.js";
import setupAssociations from "../utils/associate-models.js";

// Import model initialization functions
import { initClass } from "./class.model.js";
import { initField } from "./field.model.js";
import { initImage } from "./image.model.js";
import { initRoom } from "./room.model.js";
import { initSession } from "./session.model.js";
import { initStudent } from "./student.model.js";
import { initTeacher } from "./teacher.model.js";
import { initUser } from "./user.model.js";

/**
 * Initializes and exports database models using Sequelize.
 * 
 * @module models
 * 
 * @constant {Object} models - An object containing the initialized models.
 * @property {Object} User - The initialized User model.
 * @property {Object} Image - The initialized Image model.
 * @property {Object} Field - The initialized Field model.
 * @property {Object} Student - The initialized Student model.
 * @property {Object} Teacher - The initialized Teacher model.
 * @property {Object} Room - The initialized Room model.
 * @property {Object} Class - The initialized Class model.
 * @property {Object} Session - The initialized Session model.
 * 
 * @example
 * import { models } from './path/to/models';
 * 
 * // Accessing a model
 * const user = await models.User.findByPk(1);
 */
export const models = {
    User: initUser(sequelize),   // Initialize the User model
    Image: initImage(sequelize), // Initialize the Image model
    Field: initField(sequelize), // Initialize the Field model
    Student: initStudent(sequelize), // Initialize the Student model
    Teacher: initTeacher(sequelize), // Initialize the Teacher model
    Room: initRoom(sequelize), // Initialize the Room model
    Class: initClass(sequelize), // Initialize the Class model
    Session: initSession(sequelize), // Initialize the Session model
};

// Setup model associations
setupAssociations(models);

/**
 * Synchronizes the database with the current models.
 * 
 * This function performs the following tasks:
 * 1. **Authenticate**: Checks the database connection.
 * 2. **Sync**: Syncs models with the database schema. The `alter: true` option updates the schema to match the model definitions.
 * 
 * Logs success messages to the console after authentication and synchronization.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves when synchronization is complete.
 * @throws {Error} If authentication or synchronization fails.
 */
export async function dbSynchronize() {
    try {
        // Authenticate the connection
        await sequelize.authenticate();
        console.log("Sequelize authentication successful");

        // Sync models with the database
        await sequelize.sync({ alter: true });
        console.log("Sequelize synchronization successful");
    } catch (error) {
        console.error("Error synchronizing the database:", error);
        throw error; // Re-throw the error to be handled by higher-level logic
    }
}
