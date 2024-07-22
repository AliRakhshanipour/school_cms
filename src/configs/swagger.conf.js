import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import path from "path"
import { fileURLToPath } from 'url';

// Determine directory name for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Array of API paths to include in the Swagger documentation
const apiPaths = [
    '../controllers/**/*.swagger.js', // Adjust paths
    '../services/**/*.swagger.js', // Adjust paths
];

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'school cms api documentation',
        version: '1.0.0',
        description: '--- rest-api documentation for school-cms ---',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}/api`,
            description: 'Development server',
        },
    ],
};

// Options for Swagger docs
const options = {
    swaggerDefinition,
    apis: apiPaths,
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Serve Swagger JSON
    app.get('/swagger.json', (req, res) => {
        res.json(swaggerSpec);
    });

    // Serve ReDoc documentation
    app.get('/redoc', (req, res) => {
        res.sendFile(path.join(__dirname, 'redoc.html')); // Ensure absolute path is used
    });
};

export { setupSwagger, swaggerSpec };
