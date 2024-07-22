import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Retrieve individual database configuration parameters
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env;

console.log(process.env.DB_PASSWORD);

// Check if necessary environment variables are provided
if (!DB_USER || !DB_HOST || !DB_PORT || !DB_NAME) {
    throw new Error('Database configuration variables are not defined in environment variables.');
}

// Create a new Sequelize instance
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    dialect: 'postgres',
    logging: false, // Set to true if you want to log SQL queries
    // Additional options can be included here if needed
    // Example: pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});
