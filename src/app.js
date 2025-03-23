require('express-async-errors');
const express = require('express');

const bodyParser = require('body-parser');
const { getFromEnv } = require('./utils/commonUtils');
const { Env } = require('./enums');
const setupAndCheckEnvironment = require('./setup/environment');
const configureCors = require('./setup/cors');
const setupDbConnection = require('./setup/db');
const logger = require('./setup/logger');
const applyRoutes = require('./routes');

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err}`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
    logger.error(`Unhandled rejection: ${reason}, ${p}`);
    process.exit(1);
});

setupAndCheckEnvironment();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
configureCors(app);

applyRoutes(app);

setupDbConnection().then(() => {
    const port = getFromEnv(Env.PORT) || 3000;
    app.listen(port, () => logger.info(`Listening on port ${port}...`));
});
