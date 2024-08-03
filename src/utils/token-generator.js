import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
config();

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @function
 * @param {Object} user - The user object for which the token is generated.
 * @param {number} user.id - The ID of the user.
 * @returns {string} A JWT as a string.
 *
 * @example
 * const token = generateToken({ id: 123 });
 * console.log(token); // Example output: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */
export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
