const Transaction = require('./transaction.model');
const logger = require('../../../setup/logger');
const { runQuery } = require('../../helper/repositoryHelper');
const { ETransactionType, ETransactionStatus } = require('../../../enums');

const findAllPaymentTransactions = async () => {
    logger.debug('transactionRepository.findAllPaymentTransactions -- start');
    const transactions = await runQuery(() =>
        Transaction.find({
            type: ETransactionType.PAYMENT,
        }),
    );
    logger.debug('transactionRepository.findAllPaymentTransactions -- success');
    return transactions;
};

const findTransactionByIdForRefund = async (id, customerId) => {
    logger.debug('transactionRepository.findTransactionByIdForRefund -- start');
    if (!id || !customerId) {
        logger.warn('transactionRepository.findTransactionByIdForRefund -- invalid arg(s)');
        return null;
    }
    const transactionEntity = await runQuery(() =>
        Transaction.findOne({
            _id: id,
            customerId,
            type: ETransactionType.PAYMENT,
            status: ETransactionStatus.SUCCESS,
        }),
    );
    logger.debug('transactionRepository.findTransactionByIdForRefund -- success');
    return transactionEntity;
};

const saveTransaction = async (transactionDto) => {
    logger.debug('transactionRepository.saveTransaction -- start');
    if (!transactionDto) {
        logger.warn('transactionRepository.saveTransaction -- invalid arg(s)');
        return null;
    }
    const transaction = new Transaction(transactionDto);
    const transactionEntity = await runQuery(() => transaction.save());
    logger.debug('transactionRepository.saveTransaction -- success');
    return transactionEntity;
};

const updateTransaction = async (id, transactionDto) => {
    logger.debug('transactionRepository.updateTransaction -- start');
    if (!id || !transactionDto) {
        logger.warn('transactionRepository.updateTransaction -- invalid arg(s)');
        return null;
    }
    const transactionEntity = await runQuery(() => Transaction.findByIdAndUpdate(id, transactionDto, { new: true }));
    logger.debug('transactionRepository.updateTransaction -- success');
    return transactionEntity;
};

module.exports = {
    findAllPaymentTransactions,
    findTransactionByIdForRefund,
    saveTransaction,
    updateTransaction,
};
