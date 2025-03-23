const mongoose = require('mongoose');
const { Env } = require('../enums');
const { getFromEnv } = require('../utils/commonUtils');
const logger = require('./logger');

const setupDbConnection = () => {
    return new Promise((resolve) => {
        const dbAddr = `mongodb://${getFromEnv(Env.DB_HOST)}/${getFromEnv(Env.DB_NAME)}`;
        mongoose
            .connect(dbAddr, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 300000,
            })
            .then(() => {
                logger.info('Connected to DB...');
                resolve();
            })
            .catch((err) => {
                logger.error(`Error connecting to db ${err}`);
            });
    });
};

module.exports = setupDbConnection;
