// utils/buildData.js

/**
 * Builds an object with specified properties, omitting undefined values.
 * @param {Object} source - The source object to build the new object from.
 * @param {Array<string>} keys - The keys to include in the new object.
 * @returns {Object} - The constructed object.
 */
export const buildDataObject = (source, keys) => {
  return keys.reduce((acc, key) => {
    if (source[key] !== undefined) {
      acc[key] = source[key];
    }
    return acc;
  }, {});
};
