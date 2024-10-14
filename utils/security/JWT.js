const jwt = require("jsonwebtoken");
const Errors = require("../errors/Errors");

/**
 * JWT class providing static methods for creating and verifying JSON Web Tokens (JWT).
 *
 * @class
 */
class JWT {
  /**
   * Creates a JWT token using the provided payload and secret key.
   *
   * @static
   * @param {Object} payload - The payload to encode in the JWT.
   * @returns {string} - The generated JWT token.
   */
  static createJWTToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  }

  /**
   * Verifies the validity of a JWT token and extracts the payload data.
   *
   * @static
   * @param {string} token - The JWT token to be verified.
   * @returns {Object} - The decoded payload if the token is valid.
   * @throws {Errors} - Throws an error if the token is expired, invalid, or if there is any other issue.
   */
  static getDataFromValidToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Handle expired JWT error
        throw new Errors("Your token has expired, please log in again", 401);
      } else if (error instanceof jwt.JsonWebTokenError) {
        // Handle invalid JWT error
        throw new Errors("Invalid token, please log in again", 401);
      } else {
        // Handle any other unexpected errors
        throw new Errors("Authentication failed, please try again", 401);
      }
    }
  }
}

module.exports = JWT;
