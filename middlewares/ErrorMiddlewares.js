const Errors = require("../utils/errors/Errors");
/**
 * the main error class of app
 */
class ErrorMiddlewares {
  /**
   * return error for production mode
   * @param {Error} err
   * @returns {Object}
   */
  _errorObj(err) {
    return {
      code: err?.statusCode || 500,
      status: err?.status || "error",
      message: err?.message || "Something Wrong !",
    };
  }

  /**
   * return error for developer mode
   * @param {Error} err
   * @returns {Object}
   */
  _devErrorObj(err) {
    return {
      ...this._errorObj(err),
      isOperational: err?.isOperational || false,
      stack: err?.stack,
    };
  }

  /**
   * Receives the error and returns object has the error details,
   * if the application is in development, stack is added.
   * @returns Express Error Handle
   */
  errorHandle() {
    return (err, req, res, next) => {
      let error;
      const statusCode = err.statusCode || 500;

      if (process.env.APP_ENV === "development") {
        console.error(err);
        error = this._devErrorObj(err);
      } else {
        error = this._errorObj(err);
      }
      res.status(statusCode).json({ error });
    };
  }
}

module.exports = new ErrorMiddlewares();
