require('express-async-errors');
const express = require('express');
const winston = require('winston');

// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { getFromEnv } = require('./utils/commonUtils');
const { Env } = require('./enums');
const setupAndCheckEnvironment = require('./setup/environment');
const configureLogger = require('./setup/logger');
const configureCors = require('./setup/cors');
const setupDbConnection = require('./setup/db');

process.on('uncaughtException', (err) => {
    winston.error(`Uncaught exception: ${err}`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
    winston.error(`Unhandled rejection: ${reason}, ${p}`);
    process.exit(1);
});

setupAndCheckEnvironment();
configureLogger();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
configureCors(app);
setupDbConnection().then(() => {
    const port = getFromEnv(Env.PORT) || 3000;
    app.listen(port, () => winston.info(`Listening on port ${port}...`));
});
