/**
 * Generators class providing static methods for generating random codes
 * and handling timeouts based on string representations of time.
 *
 * @class
 */
class Generators {
  /**
   * Generates a random numerical code with a specified length.
   *
   * @static
   * @param {number} [countNumber=3] - The number of digits in the generated code.
   * @param {boolean} [isString=true] - Whether to return the result as a string or number.
   * @returns {string|number} - The generated code as a string or number.
   */
  static RandomNumbersCode(countNumber = 3, isString = true) {
    let [min, max] = [1, 9];

    for (let i = 1; i < countNumber; i++) [min, max] = [min * 10, max * 10];

    const code = Math.floor(min + Math.random() * max);

    if (isString) return code.toString();

    return code;
  }

  /**
   * Converts a time string into a timeout timestamp (in milliseconds from the current time).
   *
   * @static
   * @param {string} timeString - The time string to be converted (e.g., '5m', '2h', '1d').
   * @returns {number} - The timestamp representing the future time when the timeout will expire.
   */
  static timeOut(timeString) {
    const splitTime = timeString.split(/(?<=\d)(?=[smhd])/gi);
    let time = 0;
    switch (splitTime[1]) {
      case "s":
        time = 0;
        break;
      case "m":
        time = splitTime[0] * 60;
        break;
      case "h":
        time = splitTime[0] * 60 * 60;
        break;
      case "d":
        time = splitTime[0] * 60 * 24 * 60;
        break;
    }

    return Date.now() + time * 1000;
  }
}
module.exports = Generators;
