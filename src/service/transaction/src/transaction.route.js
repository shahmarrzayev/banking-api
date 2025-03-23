const express = require('express');

const router = express.Router();
const {
    transactionDepositController,
    transactionRefundController,
    transactionTransferController,
    transactionPaymentController,
    getAllPaymentTransactionsController,
} = require('./transaction.controller');

router.get('/payment', getAllPaymentTransactionsController);

router.post('/deposit', transactionDepositController);
router.post('/refund', transactionRefundController);
router.post('/transfer', transactionTransferController);
router.post('/payment', transactionPaymentController);

module.exports = router;
