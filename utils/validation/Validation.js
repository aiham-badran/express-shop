const { checkSchema, validationResult } = require("express-validator");

/**
 * Validation class providing methods for handling validation errors
 * and creating validation middleware using express-validator.
 *
 * @class
 */
class Validation {
  /**
   * Creates a custom JSON structure for validation errors.
   *
   * @param {Array} error - An array of error objects from validation.
   * @returns {Object} - An object containing custom error messages structured by field.
   */
  _customErrors(error) {
    return error.reduce((acc, err) => {
      // if the field is not exist then create error obj
      if (!acc[err.path]) {
        acc[err.path] = {
          field: err.path,
          messages: [],
          inputValue: err.value,
        };
      }
      // if the field is exist, add msg error
      acc[err.path].messages.push(err.msg);

      return acc;
    }, {});
  }

  /**
   * Middleware for checking if validation errors exist; sends errors or continues.
   *
   * @param {boolean} [isOnlyFirstError=false] - A flag indicating whether to return only the first error.
   * @returns {Function} - An Express middleware function.
   */
  _validationResult(isOnlyFirstError = false) {
    const self = this;
    return (req, res, next) => {
      const result = validationResult(req);

      if (result.isEmpty()) return next();

      res.status(400).json({
        status: "fail",
        code: 400,
        type: "Validation Errors",
        errors: self._customErrors(
          result.array({ onlyFirstError: isOnlyFirstError })
        ),
      });
    };
  }

  /**
   * Creates a validator middleware using a schema defined by express-validator.
   *
   * @param {Object} validationSchema - The validation schema to be used.
   * @param {Array} [location=["body"]] - The location(s) where validation should occur (e.g., ["body", "params", "query"]).
   * @returns {Function} - A middleware function that performs the validation checks.
   */
  _createCheckSchema(validationSchema, location = ["body"]) {
    return checkSchema(validationSchema, location);
  }
}

module.exports = Validation;
