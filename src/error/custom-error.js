/**
 * Represents a custom validation error.
 *
 * @class ValidationError
 * @extends {Error}
 */
class ValidationError extends Error {
  /**
   * Creates an instance of ValidationError.
   *
   * @constructor
   * @param {Array} errors - An array of validation error messages.
   */
  constructor(errors) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.status = 400;
    this.errors = errors;
  }
}

export default ValidationError;
