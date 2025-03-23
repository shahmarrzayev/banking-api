const express = require('express');
const {
    registerCustomerController,
    getCustomerByIdController,
    updateCustomerBalanceController,
    getAllCustomersController,
} = require('./customer.controller');

const router = express.Router();

router.get('/', getAllCustomersController);
router.get('/:id', getCustomerByIdController);

router.post('/', registerCustomerController);
router.put('/:id', updateCustomerBalanceController);

module.exports = router;
