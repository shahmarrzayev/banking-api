const { runQuery } = require('../../helper/repositoryHelper');
const Customer = require('./customer.model');
const logger = require('../../../setup/logger');

const findAllCustomers = async () => {
    logger.debug('customerRepository.findAll -- start');
    const customers = await runQuery(() => Customer.find());
    logger.debug('customerRepository.findAll -- success');
    return customers;
};

const findCustomerById = async (id) => {
    logger.debug('customerRepository.findById -- start');
    if (!id) {
        logger.warn('customerRepository.findById -- null param');
        return null;
    }
    const customer = await runQuery(() => Customer.findById(id));
    logger.debug('customerRepository.findById -- success');
    return customer;
};

const findCustomerByPhoneNumber = async (phoneNumber) => {
    logger.debug('customerRepository.findByPhoneNumber -- start');
    if (!phoneNumber) {
        logger.warn('customerRepository.findByPhoneNumber -- null param');
        return null;
    }
    const customer = await runQuery(() => Customer.findOne({ phoneNumber }));
    logger.debug('customerRepository.findByPhoneNumber -- success');
    return customer;
};

const saveCustomer = async (customer) => {
    logger.debug('customerRepository.saveCustomer -- start');
    if (!customer) {
        logger.warn('customerRepository.saveCustomer -- null param');
        return null;
    }
    const dbCustomer = new Customer(customer);
    const customerEntity = await runQuery(() => dbCustomer.save());
    logger.debug('customerRepository.saveCustomer -- success');
    return customerEntity;
};

const updateCustomer = async (customer) => {
    logger.debug('customerRepository.updateCustomer -- start');
    if (!customer) {
        logger.warn('customerRepository.updateCustomer -- null param');
        return null;
    }
    const customerEntity = await runQuery(() => Customer.findByIdAndUpdate(customer.id, customer, { new: true }));
    logger.debug('customerRepository.updateCustomer -- success');
    return customerEntity;
};

module.exports = {
    findAllCustomers,
    findCustomerById,
    findCustomerByPhoneNumber,
    saveCustomer,
    updateCustomer,
};
