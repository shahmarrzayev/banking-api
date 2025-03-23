const { GeneralException, ConflictException } = require('../../../exceptions');
const {
    findCustomerByPhoneNumber,
    saveCustomer,
    findCustomerById,
    updateCustomer,
    findAllCustomers,
} = require('./customer.repository');
const { mapSaveCustomerToEntity } = require('./customer.mapper');
const logger = require('../../../setup/logger');

const getAllCustomers = async () => {
    logger.debug('customerService.getAllCustomers -- start');
    const entities = await findAllCustomers();
    logger.debug('customerService.getAllCustomers -- success');
    return entities;
};

const getCustomerById = async (id) => {
    logger.debug('customerService.getCustomerById -- start');
    if (!id) {
        logger.warn('customerService.getCustomerById -- invalid arg(s)');
        throw new GeneralException('Invalid arg(s)');
    }

    const entity = await findCustomerById(id);
    if (!entity) {
        logger.warn('customerService.getCustomerById -- customer not found');
        throw new ConflictException('Customer not found');
    }
    return entity;
};

const registerCustomer = async (customerDto) => {
    logger.debug('customerService.registerCustomer -- start');
    if (!customerDto) {
        logger.warn('customerService.registerCustomer -- invalid arg(s)');
        throw new GeneralException('Invalid arg(s)');
    }

    const customerExists = await findCustomerByPhoneNumber(customerDto.phoneNumber);
    if (customerExists) {
        logger.warn('customerService.registerCustomer -- customer already exists');
        throw new ConflictException('Customer already exists');
    }

    let entity = mapSaveCustomerToEntity(customerDto);
    entity = await saveCustomer(entity);
    if (!entity) {
        logger.warn('customerService.registerCustomer -- could not save customer');
        throw new GeneralException();
    }
    return entity;
};

const updateCustomerBalance = async (id, amount) => {
    logger.debug('customerService.updateCustomerBalance -- start');
    if (!amount) {
        logger.warn('customerService.updateCustomerBalance -- invalid arg(s)');
        throw new GeneralException('Invalid arg(s)');
    }

    const customer = await findCustomerById(id);
    if (!customer) {
        logger.warn('customerService.updateCustomerBalance -- customer not found');
        throw new ConflictException('Customer not found');
    }

    if (customer.balance + amount < 0) {
        logger.warn('customerService.updateCustomerBalance -- insufficient funds');
        throw new ConflictException('Insufficient funds');
    }

    customer.balance += amount;
    const entity = await updateCustomer(customer);
    if (!entity) {
        logger.warn('customerService.updateCustomerBalance -- could not update customer');
        throw new GeneralException();
    }

    logger.debug('customerService.updateCustomerBalance -- success');
    return entity;
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    registerCustomer,
    updateCustomerBalance,
};
