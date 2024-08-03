/**
 * Returns an object containing predefined authentication messages.
 *
 * @function
 * @returns {Object} An object with authentication messages as properties.
 *
 * @example
 * const messages = AuthMsg();
 * console.log(messages.REGISTERED); // Output: "user registered successfully"
 */
export function AuthMsg() {
  return Object.freeze({
    REGISTERED: 'user registered successfully',
    LOGGED_IN: 'user logged in successfully',
    LOGGED_OUT: 'user logged out successfully',
    USER_EXIST: 'username, email, or phone number already exists',
    OTP_EXPIRED: 'Invalid or expired OTP',
    UNAUTHORIZED: 'Invalid credentials',
    VERIFIES_TOKEN: 'Token verification done',
  });
}
