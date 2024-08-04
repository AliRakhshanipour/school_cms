import express from 'express';
import { connectMongoDB } from './src/configs/database.conf.js';
import './src/configs/dotenv-config.js';
import './src/configs/passport.conf.js';
import Server from './src/configs/server.conf.js';
import { setupSwagger } from './src/configs/swagger.conf.js';
import { ErrorHandlers } from './src/error/error.handlers.js';
import { middlewares } from './src/middlewares/main.middleware.js';
import { dbSynchronize } from './src/models/index.js';
import mainRoutes from './src/routes/index.js';

/**
 * Initialize and start the Express server.
 * Handles middleware, error handling, database connection, and server startup.
 */
export const app = express();
const startServer = async () => {
  // Start DB connection
  try {
    await connectMongoDB(); // Connect to MongoDB if using it
    await dbSynchronize(); // Synchronize database models
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    process.exit(1); // Exit if DB connection fails
  }

  // // Initialize AdminJS
  // const admin = new AdminJS(adminOptions);
  // const AdminJSRouter = AdminJSExpress.buildRouter(admin);
  // app.use(admin.options.rootPath, AdminJSRouter); // Set AdminJS routes

  // Middleware setup
  app.use(...middlewares);

  // Swagger configuration
  setupSwagger(app);

  // Main routes
  app.use('/', mainRoutes);

  // Error handling middlewares
  app.use(...ErrorHandlers);

  const port = process.env.PORT || 3000;

  // Create the server and start listening
  const server = new Server(port, app);
  server.start();

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            console.error('Error closing server:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log('Server closed.');
    } catch (error) {
      console.error('Error during shutdown:', error);
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

// Execute the server startup
startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
