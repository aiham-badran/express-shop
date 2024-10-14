const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Errors = require("../errors/Errors");
/**
 * Security class providing static methods for hashing and comparing data
 * using cryptographic techniques.
 *
 * @class
 */
class Security {
  /**
   * Hashes a given code using SHA-256 algorithm.
   *
   * @static
   * @param {string} code - The code to be hashed.
   * @returns {string} - The hashed code in hexadecimal format.
   */
  static hashCode(code) {
    return crypto.createHash("sha256").update(code).digest("hex");
  }

  /**
   * Compares a plaintext data with a hashed bcrypt data.
   *
   * @static
   * @async
   * @param {string} data - The plaintext data to compare.
   * @param {string} bcryptData - The hashed data to compare against.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating
   * whether the data matches the hashed data.
   */
  static async bcryptCompare(data, bcryptData) {
    try {
      return await bcrypt.compare(data, bcryptData);
    } catch (err) {
      throw new Errors(err, 400);
    }
  }

  /**
   * Hashes data using bcrypt with a specified salt rounds.
   *
   * @static
   * @async
   * @param {string} data - The data to be hashed.
   * @returns {Promise<string>} - A promise that resolves to the hashed data.
   */
  static async bcryptData(data) {
    return bcrypt.hash(data, 12);
  }
}

module.exports = Security;
