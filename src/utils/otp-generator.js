/**
 * Generates a 6-digit One-Time Password (OTP).
 *
 * @function
 * @returns {string} A 6-digit OTP as a string.
 *
 * @example
 * const otp = generateOTP();
 * console.log(otp); // Example output: '123456'
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
