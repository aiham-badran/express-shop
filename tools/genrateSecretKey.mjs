import { randomBytes } from "crypto";
import clipboardy from "clipboardy";

/**
 * Generates a complex token of specified length using random bytes.
 *
 * @param {number} length - The desired length of the token.
 * @returns {string} - A base64-encoded token of the specified length.
 */

function generateComplexToken(length) {
  return randomBytes(Math.ceil(length / 2))
    .toString("base64")
    .slice(0, length);
}

const token = generateComplexToken(128);
clipboardy.writeSync(token); // Copy the token to the clipboard
console.log(`Token copied to clipboard: \n ${token}`);
