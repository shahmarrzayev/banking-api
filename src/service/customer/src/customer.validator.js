const Joi = require('joi');

const validateAmount = (body) => {
    const { error } = Joi.object({
        amount: Joi.number().required(),
    }).validate(body);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

const validateCustomer = (body) => {
    const { error } = Joi.object({
        firstName: Joi.string().min(3).max(256).required(),
        lastName: Joi.string().min(3).max(256).required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        birthDate: Joi.date().required(),
    }).validate(body);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

module.exports = {
    validateAmount,
    validateCustomer,
};
