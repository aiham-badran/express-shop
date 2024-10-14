/**
 * Custom Error class that extends the built-in JavaScript Error object.
 * Provides additional functionality such as setting a status code and status message,
 * which can be used for consistent error handling throughout the application.
 *
 * @class Errors
 * @extends Error
 */
class Errors extends Error {
  /**
   * Creates an instance of Errors.
   *
   * @constructor
   * @param {String} message - The error message to be displayed.
   * @param {Number} statusCode - The HTTP status code associated with the error (e.g., 400, 500).
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = this._setStatus();
    this.isOperational = true; // Marks the error as operational (to distinguish from programming errors)
  }

  /**
   * Determines the error status based on the status code.
   * If the status code starts with '4', it is a 'fail' status, otherwise it is 'error'.
   *
   * @private
   * @returns {String} - Returns 'fail' if the status code starts with '4', otherwise 'error'.
   */
  _setStatus() {
    return `${this.statusCode}`.startsWith(4) ? "fail" : "error";
  }
}

module.exports = Errors;
