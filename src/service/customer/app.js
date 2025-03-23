require('express-async-errors');
const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { getFromEnv } = require('../../utils/commonUtils');
const { Env } = require('../../enums');
const setupAndCheckEnvironment = require('../../setup/environment');
const configureCors = require('../../setup/cors');
const setupDbConnection = require('../../setup/db');
const router = require('./src/customer.route');
const errorMiddleware = require('../../middleware/errorMw');
const logger = require('../../setup/logger');

setupAndCheckEnvironment();

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err}`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
    logger.error(`Unhandled rejection: ${reason}, ${p}`);
    process.exit(1);
});

const app = express();
configureCors(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/customers', router);
app.use(errorMiddleware);

setupDbConnection()
    .then(() => {
        const port = getFromEnv(Env.PORT) || 3000;
        app.listen(port, () => logger.info(`Listening on port ${port}...`));
    })
    .catch(() => process.exit(1));
