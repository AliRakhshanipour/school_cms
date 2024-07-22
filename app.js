/**
 * Entry point of the application.
 * 
 * @module
 * @requires express
 * @requires ./src/configs/server.conf.js
 * @requires ./src/configs/dotenv-config.js
 * @requires ./src/middlewares/main.middleware.js
 * @requires ./src/error/error.handlers.js
 */

import e from "express";
import Server from "./src/configs/server.conf.js";
import "./src/configs/dotenv-config.js";
import { middlewares } from "./src/middlewares/main.middleware.js";
import { ErrorHandlers } from "./src/error/error.handlers.js";
import { setupSwagger } from "./src/configs/swagger.conf.js";
import path from "path"
import { fileURLToPath } from 'url';

// Determine directory name for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main function that initializes and starts the Express server.
 * 
 * @function
 */
const main = () => {
    // Initialize Express application
    const app = e();

    // Apply middlewares
    // `middlewares` is an array of middleware functions applied to the Express app
    app.use(...middlewares);
    setupSwagger(app)

    // Serve ReDoc documentation
    app.get('/redoc', (req, res) => {
        res.sendFile(path.join(__dirname, 'src', 'configs', 'redoc.html')); // Ensure absolute path is used
    });

    // Apply error handlers
    // `ErrorHandlers` is an array of error handling middleware functions
    app.use(...ErrorHandlers);

    // Start the server
    const port = process.env.PORT || 3000;
    new Server(port, app).start();
};

// Run the main function to start the application
main();
