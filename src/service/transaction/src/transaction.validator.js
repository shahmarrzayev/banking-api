const Joi = require('joi');

const validateTransaction = (body) => {
    const { error } = Joi.object({
        customerId: Joi.string().required(),
        amount: Joi.number().positive().required(),
    }).validate(body);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

const validateRefund = (body) => {
    const { error } = Joi.object({
        customerId: Joi.string().required(),
        transactionId: Joi.string().required(),
    }).validate(body);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

const validateTransfer = (body) => {
    const { error } = Joi.object({
        customerId: Joi.string().required(),
        toCustomerId: Joi.string().required(),
        amount: Joi.number().required(),
    }).validate(body);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

module.exports = {
    validateTransaction,
    validateRefund,
    validateTransfer,
};
