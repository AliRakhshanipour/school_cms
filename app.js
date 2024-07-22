/**
 * Entry point of the application.
 * 
 * This module initializes and starts the Express server, sets up middleware, 
 * configures Swagger for API documentation, synchronizes the database, 
 * and applies error handlers.
 * 
 * @module
 * @requires express
 * @requires ./src/configs/server.conf.js
 * @requires ./src/configs/dotenv-config.js
 * @requires ./src/middlewares/main.middleware.js
 * @requires ./src/error/error.handlers.js
 * @requires ./src/configs/swagger.conf.js
 * @requires ./src/models/index.js
 */

import e from "express";
import Server from "./src/configs/server.conf.js";
import "./src/configs/dotenv-config.js";
import { middlewares } from "./src/middlewares/main.middleware.js";
import { ErrorHandlers } from "./src/error/error.handlers.js";
import { setupSwagger } from "./src/configs/swagger.conf.js";
import { dbSyncronize } from "./src/models/index.js";

/**
 * Main function that initializes and starts the Express server.
 * 
 * This function performs the following tasks:
 * 1. **Initialize Express Application**: Creates an instance of the Express application.
 * 2. **Apply Middlewares**: Applies an array of middleware functions to the Express app.
 * 3. **Setup Swagger**: Configures Swagger for API documentation.
 * 4. **Synchronize Database**: Connects to the database and syncs models.
 * 5. **Apply Error Handlers**: Applies an array of error handling middleware functions.
 * 6. **Start Server**: Starts the server on a specified port.
 * 
 * @async
 * @function
 */
const main = async () => {
    // Initialize Express application
    const app = e();

    // Apply middlewares
    // `middlewares` is an array of middleware functions applied to the Express app
    app.use(...middlewares);

    // Setup Swagger for API documentation
    setupSwagger(app);

    // Synchronize the database
    await dbSyncronize();

    // Apply error handlers
    // `ErrorHandlers` is an array of error handling middleware functions
    app.use(...ErrorHandlers);

    // Start the server
    const port = process.env.PORT || 3000;
    new Server(port, app).start();
};

// Run the main function to start the application
main();
