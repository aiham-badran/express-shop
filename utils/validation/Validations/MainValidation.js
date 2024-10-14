const Validation = require("../Validation");

/**
 * MainValidation class extending Validation to manage validation schemas
 * for creating and updating resources, as well as validating parameters.
 *
 * @class
 * @extends {Validation}
 */
class MainValidation extends Validation {
  /**
   * Creates an instance of MainValidation.
   *
   * @constructor
   * @param {Object} createSchema - The schema for creating resources.
   * @param {Object} updateSchema - The schema for updating resources.
   * @param {Object} paramSchema - The schema for validating parameters.
   */
  constructor(createSchema, updateSchema, paramSchema) {
    super();
    this._createSchema = createSchema;
    this._updateSchema = updateSchema;
    this._paramSchema = paramSchema;
  }

  /**
   * Returns the validation middleware for creating resources.
   *
   * @returns {Array|undefined} - An array of middleware functions for validation,
   * or undefined if no create schema is provided.
   */
  whenCreate() {
    if (this._createSchema)
      return [
        this._createCheckSchema(this._createSchema),
        this._validationResult(),
      ];
  }

  /**
   * Returns the validation middleware for updating resources.
   *
   * @returns {Array|undefined} - An array of middleware functions for validation,
   * or undefined if no update schema is provided.
   */
  whenUpdate() {
    if (this._updateSchema)
      return [
        this._createCheckSchema(this._paramSchema, ["params"]),
        this._createCheckSchema(this._updateSchema),
        this._validationResult(),
      ];
  }

  /**
   * Returns the validation middleware for checking parameters.
   *
   * @returns {Array|undefined} - An array of middleware functions for validation,
   * or undefined if no parameter schema is provided.
   */
  checkParam() {
    if (this._paramSchema)
      return [
        this._createCheckSchema(this._paramSchema, ["params"]),
        this._validationResult(),
      ];
  }
}

module.exports = MainValidation;
