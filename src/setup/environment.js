require('dotenv').config();

const { Env } = require('../enums');
const { getFromEnv } = require('../utils/commonUtils');
const logger = require('./logger');

const setupAndCheckEnvironment = () => {
    Object.values(Env).forEach((environmentVariable) => {
        const value = getFromEnv(environmentVariable);
        if (!value) {
            logger.error(`Environment variable ${environmentVariable} is missing`);
            // eslint-disable-next-line no-undef
            process.exit(1);
        }
    });
};

module.exports = setupAndCheckEnvironment;
