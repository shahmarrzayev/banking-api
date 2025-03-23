const { BadRequestException } = require('../../../exceptions');
const logger = require('../../../setup/logger');
const { mapTransactionEntityToPublicDto } = require('./transaction.mapper');
const {
    transactionDeposit,
    transactionRefund,
    transactionTransfer,
    transactionPayment,
    getAllPaymentTransactions,
} = require('./transaction.service');
const { validateTransaction, validateTransfer, validateRefund } = require('./transaction.validator');

const getAllPaymentTransactionsController = async (req, res) => {
    logger.debug('transactionController.getAllPaymentTransactions -- start');
    const transactions = await getAllPaymentTransactions();
    logger.debug('transactionController.getAllPaymentTransactions -- success');
    return res.send(transactions.map(mapTransactionEntityToPublicDto));
};

const transactionDepositController = async (req, res) => {
    logger.debug('transactionController.transactionDeposit -- start');
    const error = validateTransaction(req.body);
    if (error) {
        logger.error(`transactionController.transactionDeposit -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const transactionEntity = await transactionDeposit(req.body);
    logger.debug('transactionController.transactionDeposit -- success');
    return res.send(mapTransactionEntityToPublicDto(transactionEntity));
};

const transactionPaymentController = async (req, res) => {
    logger.debug('transactionController.transactionPayment -- start');
    const error = validateTransaction(req.body);
    if (error) {
        logger.error(`transactionController.transactionPayment -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const transactionEntity = await transactionPayment(req.body);
    logger.debug('transactionController.transactionPayment -- success');
    return res.send(mapTransactionEntityToPublicDto(transactionEntity));
};

const transactionRefundController = async (req, res) => {
    logger.debug('transactionController.transactionRefund -- start');
    const error = validateRefund(req.body);
    if (error) {
        logger.error(`transactionController.transactionRefund -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const transactionEntity = await transactionRefund(req.body);
    logger.debug('transactionController.transactionRefund -- success');
    return res.send(mapTransactionEntityToPublicDto(transactionEntity));
};

const transactionTransferController = async (req, res) => {
    logger.debug('transactionController.transactionTransfer -- start');
    const error = validateTransfer(req.body);
    if (error) {
        logger.error(`transactionController.transactionTransfer -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const transactionEntity = await transactionTransfer(req.body);
    logger.debug('transactionController.transactionTransfer -- success');
    return res.send(mapTransactionEntityToPublicDto(transactionEntity));
};

module.exports = {
    getAllPaymentTransactionsController,
    transactionDepositController,
    transactionRefundController,
    transactionTransferController,
    transactionPaymentController,
};
