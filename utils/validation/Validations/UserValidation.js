const MainValidation = require("./MainValidation");

/**
 * UserValidation class extending MainValidation to manage validation schemas
 * specifically for user-related operations such as login, changing passwords,
 * and resetting passwords.
 *
 * @class
 * @extends {MainValidation}
 */
class UserValidation extends MainValidation {
  /**
   * Creates an instance of UserValidation.
   *
   * @constructor
   * @param {Object} createSchema - The schema for creating users.
   * @param {Object} updateSchema - The schema for updating user information.
   * @param {Object} paramsSchema - The schema for validating user parameters.
   * @param {Object} loginSchema - The schema for user login validation.
   * @param {Object} changePasswordSchema - The schema for changing user password validation.
   * @param {Object} resetPasswordSchema - The schema for resetting user password validation.
   */
  constructor(
    createSchema,
    updateSchema,
    paramsSchema,
    loginSchema,
    changePasswordSchema,
    resetPasswordSchema
  ) {
    super(createSchema, updateSchema, paramsSchema);
    this._loginSchema = loginSchema;
    this._changePasswordSchema = changePasswordSchema;
    this._resetPasswordSchema = resetPasswordSchema;
  }

  /**
   * Returns the validation middleware for user login.
   *
   * @returns {Array} - An array of middleware functions for validating user login.
   */
  whenLogin() {
    return [
      this._createCheckSchema(this._loginSchema, ["body"]),
      this._validationResult(),
    ];
  }

  /**
   * Returns the validation middleware for changing user passwords.
   *
   * @returns {Array} - An array of middleware functions for validating password changes.
   */
  whenChangePassword() {
    return [
      this._createCheckSchema(this._changePasswordSchema, ["body"]),
      this._validationResult(),
    ];
  }

  /**
   * Returns the validation middleware for resetting user passwords.
   *
   * @returns {Array} - An array of middleware functions for validating password resets.
   */
  whenResetPassword() {
    return [
      this._createCheckSchema(this._resetPasswordSchema, ["body"]),
      this._validationResult(),
    ];
  }
}

module.exports = UserValidation;
