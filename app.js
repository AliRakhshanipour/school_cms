import express from 'express';
import Server from './src/configs/server.conf.js';
import './src/configs/dotenv-config.js';
import { middlewares } from './src/middlewares/main.middleware.js';
import { ErrorHandlers } from './src/error/error.handlers.js';
import { setupSwagger } from './src/configs/swagger.conf.js';
import { dbSyncronize } from './src/models/index.js';
import mainRoutes from './src/routes/index.js';

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
    try {
        // Initialize Express application
        const app = express(); // Use 'express()' to create an app instance

        // Apply middlewares
        // Ensure middlewares are correctly defined
        app.use(...middlewares);

        // Setup Swagger for API documentation
        setupSwagger(app);

        // Use main routes
        app.use('/', mainRoutes);

        // Synchronize the database
        await dbSyncronize();

        // Apply error handlers
        // Ensure error handlers are correctly defined
        app.use(...ErrorHandlers);

        // Start the server
        const port = process.env.PORT || 3000;
        new Server(port, app).start();

    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit the process with failure code
    }
};

// Run the main function to start the application
main();
