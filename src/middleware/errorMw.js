/* eslint-disable no-unused-vars */

const logger = require('../setup/logger');

const errorMiddleware = (err, req, res, next) => {
    logger.error(err ? `${err.name}: ${err.message} - ${err.reason ? err.reason : req.method}` : 'Error');
    const errorCode = err.code || 500;
    res.status(errorCode).send({
        errors: [
            {
                detail: err.message || 'Internal server error',
                source: req.originalUrl,
                status: errorCode,
                title: err.title || 'Internal server error',
            },
        ],
    });
};

module.exports = errorMiddleware;
