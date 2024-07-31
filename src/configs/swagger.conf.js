import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine the filename and directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Array of API paths to include in the Swagger documentation
const apiPaths = [
    path.join(__dirname, "..", "controllers", "**", "*.swagger.js"), // Paths for controller Swagger comments
    path.join(__dirname, "..", "services", "**", "*.swagger.js"),    // Paths for service Swagger comments
    path.join(__dirname, "..", "log", "**", "*.swagger.js"),    // Paths for logger Swagger comments
    path.join(__dirname, "..", "log", "*.swagger.js"),    // Paths for logger Swagger comments
];

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0', // OpenAPI version
    info: {
        title: 'School CMS API Documentation', // Title of the API documentation
        version: '1.0.0', // Version of the API
        description: 'REST API documentation for the School CMS project.', // Brief description of the API
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}`, // Base URL for the API
            description: 'Development server', // Description of the server environment
        },
    ],
    components: {
        securitySchemes: {
            JwtAuth: {
                type: 'http', // Authentication type
                scheme: 'bearer', // Scheme for bearer tokens
                bearerFormat: 'JWT', // Format for the bearer token
                description: 'JWT authentication using bearer tokens', // Description of the JWT authentication method
            },
        },
    },
    security: [
        {
            JwtAuth: [], // Applies JWT authentication to all endpoints by default
        },
    ],
    tags: [ // Define tags for organizing endpoints
        {
            name: 'Authentication', // Tag for authentication-related endpoints
            description: 'Endpoints related to authentication and authorization' // Description of the Auth tag
        },
        {
            name: 'Users', // Tag for user-related endpoints
            description: 'Endpoints related to user operations' // Description of the Users tag
        },
        {
            name: 'Rooms', // Tag for room-related endpoints
            description: 'Endpoints related to room operations' // Description of the Rooms tag
        },
        {
            name: 'Students', // Tag for student-related endpoints
            description: 'Endpoints related to student operations' // Description of the Students tag
        },
        {
            name: 'Fields', // Tag for field-related endpoints
            description: 'Endpoints related to field operations' // Description of the Fields tag
        },
        {
            name: 'Teachers', // Tag for teacher-related endpoints
            description: 'Endpoints related to teacher operations' // Description of the Teachers tag
        },

    ],
};

// Options for Swagger documentation setup
const options = {
    swaggerDefinition, // Swagger definition containing metadata and security information
    apis: apiPaths, // Paths to the files containing Swagger comments
};

// Initialize swagger-jsdoc to generate Swagger documentation based on the defined options
const swaggerSpec = swaggerJsdoc(options);

// Function to setup Swagger UI and other documentation endpoints
const setupSwagger = (app) => {
    // Serve Swagger UI at /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Serve Swagger JSON at /swagger.json endpoint
    app.get('/swagger.json', (req, res) => {
        res.json(swaggerSpec);
    });

    // Serve ReDoc documentation at /redoc endpoint
    app.get('/redoc', (req, res) => {
        res.sendFile(path.join(__dirname, 'redoc.html')); // Serve the ReDoc documentation from an HTML file
    });
};

// Export the setupSwagger function and the Swagger specification
export { setupSwagger, swaggerSpec };
