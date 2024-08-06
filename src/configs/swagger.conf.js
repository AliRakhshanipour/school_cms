import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';

// Resolve the current directory path by using a relative path or setting an environment variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// Use a project root directory or configure the path based on your needs
const projectRoot = path.resolve(); // This should be the root directory of your project

// Array of API paths to include in the Swagger documentation
const apiPaths = [
  path.join(__dirname, '..', 'controllers', '**', '*.swagger.js'),
  path.join(__dirname, '..', 'services', '**', '*.swagger.js'),
  path.join(__dirname, '..', 'log', '**', '*.swagger.js'),
  path.join(__dirname, '..', 'log', '*.swagger.js'),
];

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'School CMS API Documentation',
    version: '1.0.0',
    description: 'REST API documentation for the School CMS project.',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      JwtAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authentication using bearer tokens',
      },
    },
  },
  security: [
    {
      JwtAuth: [],
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Endpoints related to authentication and authorization',
    },
    { name: 'Users', description: 'Endpoints related to user operations' },
    { name: 'Rooms', description: 'Endpoints related to room operations' },
    {
      name: 'Sessions',
      description: 'Endpoints related to session operations',
    },
    { name: 'Classes', description: 'Endpoints related to class operations' },
    {
      name: 'Students',
      description: 'Endpoints related to student operations',
    },
    { name: 'Fields', description: 'Endpoints related to field operations' },
    {
      name: 'Teachers',
      description: 'Endpoints related to teacher operations',
    },
    {
      name: 'Attendances',
      description: 'Endpoints related to attendance operations',
    },
  ],
};

// Options for Swagger documentation setup
const options = {
  swaggerDefinition,
  apis: apiPaths,
};

// Initialize swagger-jsdoc to generate Swagger documentation based on the defined options
const swaggerSpec = swaggerJsdoc(options);

// Function to setup Swagger UI and other documentation endpoints
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
  });
  app.get('/redoc', (req, res) => {
    res.sendFile(path.join(projectRoot, 'redoc.html'));
  });
};

// Export the setupSwagger function and the Swagger specification
export { setupSwagger, swaggerSpec };
