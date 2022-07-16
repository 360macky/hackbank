/**
 * Returns de number of decimals.
 * @param {number} number
 * @returns {number} Number of decimals
 */
const countDecimals = (number) =>
  number % 1 ? number.toString().split('.')[1].length : 0;

/**
 * Returns a formatted number to display as string.
 * @param {number} number Number
 * @returns {string} Formatted number
 */
export default function (number) {
  if (number % 1 == 0) {
    return `${number}.00`;
  }
  if (countDecimals(number) < 2) {
    return `${number}0`;
  }
  return String(number);
}
