const { BadRequestException } = require('../../../exceptions');
const { registerCustomer, getCustomerById, updateCustomerBalance, getAllCustomers } = require('./customer.service');
const { validateCustomer, validateAmount } = require('./customer.validator');
const { mapCustomerEntityToPublicDto } = require('./customer.mapper');
const logger = require('../../../setup/logger');

const getAllCustomersController = async (req, res) => {
    logger.debug('customerController.getAllCustomers -- start');
    const customers = await getAllCustomers();
    logger.debug('customerController.getAllCustomers -- success');
    return res.send(customers.map(mapCustomerEntityToPublicDto));
};

const getCustomerByIdController = async (req, res) => {
    logger.debug('customerController.getCustomerById -- start');
    const customerEntity = await getCustomerById(req.params.id);
    logger.debug('customerController.getCustomerById -- success');
    return res.send(mapCustomerEntityToPublicDto(customerEntity));
};

const registerCustomerController = async (req, res) => {
    logger.debug('customerController.registerCustomer -- start');
    const error = validateCustomer(req.body);
    if (error) {
        logger.warn(`customerController.registerCustomer -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const customerEntity = await registerCustomer(req.body);
    logger.debug('customerController.registerCustomer -- success');
    return res.send(mapCustomerEntityToPublicDto(customerEntity));
};

const updateCustomerBalanceController = async (req, res) => {
    logger.debug('customerController.updateCustomerBalance -- start');
    const error = validateAmount(req.body);
    if (error) {
        logger.warn(`customerController.updateCustomerBalance -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const customerEntity = await updateCustomerBalance(req.params.id, req.body.amount);
    logger.debug('customerController.updateCustomerBalance -- success');
    return res.send(mapCustomerEntityToPublicDto(customerEntity));
};

module.exports = {
    getAllCustomersController,
    getCustomerByIdController,
    registerCustomerController,
    updateCustomerBalanceController,
};
