import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// PostgreSQL configuration
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env;

// MongoDB configuration
const {
    MONGO_URI,
    MONGO_DB_NAME
} = process.env;

// Validate environment variables
(() => {
    if (!DB_USER || !DB_HOST || !DB_PORT || !DB_NAME) {
        throw new Error('PostgreSQL configuration variables are not defined in environment variables.');
    }

    if (!MONGO_URI || !MONGO_DB_NAME) {
        throw new Error('MongoDB configuration variables are not defined in environment variables.');
    }
})()

// PostgreSQL setup with Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    dialect: 'postgres',
    logging: false, // Set to true if you want to log SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// MongoDB setup with Mongoose
const connectMongoDB = async () => {
    try {
        const uri = `${MONGO_URI}/${MONGO_DB_NAME}`;
        await mongoose.connect(uri, {
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

// Export configurations and connection functions
export { sequelize, connectMongoDB };
