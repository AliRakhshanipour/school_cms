import { sequelize } from "../configs/database.conf.js"
import setupAssociations from "../utils/associate-models.js"
import { initField } from "./field.model.js"
import { initImage } from "./image.model.js"
import { initStudent } from "./student.model.js"
import { initUser } from "./user.model.js"




// Define and initialize models
export const models = {
    User: initUser(sequelize), // Initialize the User model with the Sequelize instance
    Image: initImage(sequelize), // Initialize the Image model with the Sequelize instance
    Field: initField(sequelize), // Initialize the Field model with the Sequelize instance
    Student: initStudent(sequelize), // Initialize the Student model with the Sequelize instance
}



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
