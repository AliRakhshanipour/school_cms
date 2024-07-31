import { sequelize } from "../configs/database.conf.js"
import setupAssociations from "../utils/associate-models.js"
import { initClass } from "./class.model.js"
import { initField } from "./field.model.js"
import { initImage } from "./image.model.js"
import { initRoom } from "./room.model.js"
import { initStudent } from "./student.model.js"
import { initTeacher } from "./teacher.model.js"
import { initUser } from "./user.model.js"




/**
 * Defines and initializes the database models using Sequelize.
 * 
 * @module models
 * 
 * @constant {Object} models - An object containing the initialized models.
 * @property {Object} User - The initialized User model.
 * @property {Object} Image - The initialized Image model.
 * @property {Object} Field - The initialized Field model.
 * @property {Object} Student - The initialized Student model.
 * 
 * @example
 * // Example usage
 * import { models } from './path/to/models';
 * 
 * // Accessing a model
 * const user = await models.User.findByPk(1);
 */
export const models = {
    User: initUser(sequelize),    // Initialize the User model with the Sequelize instance
    Image: initImage(sequelize),   // Initialize the Image model with the Sequelize instance
    Field: initField(sequelize),    // Initialize the Field model with the Sequelize instance
    Student: initStudent(sequelize), // Initialize the Student model with the Sequelize instance
    Teacher: initTeacher(sequelize), // Initialize the Student model with the Sequelize instance
    Room: initRoom(sequelize), // Initialize the Room model with the Sequelize instance
    Class: initClass(sequelize), // Initialize the Class model with the Sequelize instance
};



// Setup model associations
setupAssociations(models)

/**
 * Synchronizes the database with the current models.
 * 
 * This function performs the following tasks:
 * 1. **Authenticate**: Checks the database connection to ensure it is working correctly.
 * 2. **Sync**: Syncs the models with the database. The `alter: true` option modifies the tables to match the model definitions, adding or updating columns as needed.
 * 
 * Logs success messages to the console after authentication and synchronization are completed.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the database synchronization is complete.
 */
export async function dbSyncronize() {
    // Authenticate the connection
    await sequelize.authenticate()
    console.log("sequelize authentication successfully done");

    // Sync models with the database
    await sequelize.sync({ alter: true })
    console.log("sequelize syncing successfully done");
}
