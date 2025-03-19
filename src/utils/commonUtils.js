/**
 * Safely gets environment variable.
 * @param {String} value
 * @returns {String} value of the environment variable
 */
const getFromEnv = (value) => (value ? process.env[value] : null);

module.exports = {
    getFromEnv,
};
