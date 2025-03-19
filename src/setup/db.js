const mongoose = require('mongoose');
const winston = require('winston');

const { Env } = require('../enums');
const { getFromEnv } = require('../utils/commonUtils');

const setupDbConnection = () => {
    return new Promise((resolve) => {
        const dbAddr = `mongodb://${getFromEnv(Env.DB_HOST)}/${getFromEnv(Env.DB_NAME)}`;
        mongoose
            .connect(dbAddr, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 300000,
            })
            .then(() => {
                winston.info('Connected to DB...');
                resolve();
            })
            .catch((err) => {
                winston.error(`Error connecting to db ${err}`);
            });
    });
};

module.exports = setupDbConnection;
