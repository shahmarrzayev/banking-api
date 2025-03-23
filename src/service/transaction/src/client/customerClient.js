/* eslint-disable no-return-await */
const axios = require('axios');
const logger = require('../../../../setup/logger');

const client = axios.create({ baseURL: 'http://localhost:3001/api' });

const runRequest = async (request) => {
    let result = null;
    try {
        result = await request();
    } catch (error) {
        if (error && error.response && error.response.data) {
            result = { errors: error.response.data.errors };
        } else result = { errors: error.message };
        logger.error(`customerClient.runRequest --, ${error}`);
    }
    return result;
};

const getCustomerById = async (customerId) => {
    return await runRequest(async () => {
        const result = await client.get(`/customers/${customerId}`);
        if (result) return result.data;
        return null;
    });
};

const updateCustomerBalance = async (id, amount) => {
    return await runRequest(async () => {
        const result = await client.put(`/customers/${id}`, { amount });
        if (result) return result.data;
        return null;
    });
};

module.exports = {
    getCustomerById,
    updateCustomerBalance,
};
