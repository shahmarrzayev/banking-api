const { ETransactionType, ETransactionStatus } = require('../../../enums');
const {
    GeneralException,
    ClientException,
    BadRequestException,
    NotFoundException,
    ConflictException,
} = require('../../../exceptions');
const logger = require('../../../setup/logger');
const { getCustomerById, updateCustomerBalance } = require('./client/customerClient');
const { mapSaveTransactionToEntity } = require('./transaction.mapper');
const {
    saveTransaction,
    updateTransaction,
    findAllPaymentTransactions,
    findTransactionByIdForRefund,
} = require('./transaction.repository');

const getAllPaymentTransactions = async () => {
    logger.debug('transactionService.getAllPaymentTransactions -- start');
    const transactions = await findAllPaymentTransactions();
    logger.debug('transactionService.getAllPaymentTransactions -- success');
    return transactions;
};

const transactionDeposit = async (transactionDto) => {
    logger.debug('transactionService.transactionDeposit -- start');
    if (!transactionDto) {
        logger.warn('transactionService.transactionDeposit -- invalid arg(s)');
        throw new BadRequestException('Invalid arg(s)');
    }

    let transactionEntity = mapSaveTransactionToEntity(transactionDto);
    transactionEntity.type = ETransactionType.DEPOSIT;
    transactionEntity = await saveTransaction(transactionEntity);
    if (!transactionEntity) {
        logger.warn('transactionService.transactionDeposit -- could not save transaction');
        throw new GeneralException();
    }

    const customer = await getCustomerById(transactionDto.customerId);
    if (!customer) {
        logger.warn('transactionService.transactionDeposit -- customer not found');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Customer not found',
        });
        throw new NotFoundException('Customer not found');
    }

    const savedCustomer = await updateCustomerBalance(transactionDto.customerId, transactionDto.amount);
    if (!savedCustomer || savedCustomer.errors) {
        logger.warn('transactionService.transactionDeposit -- could not update customer');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: savedCustomer.errors[0].detail,
        });
        throw new ClientException(savedCustomer.errors);
    }

    transactionEntity = await updateTransaction(transactionEntity.id, { status: ETransactionStatus.SUCCESS });
    logger.debug('transactionService.transactionDeposit -- success');
    return transactionEntity;
};

const transactionPayment = async (transactionDto) => {
    logger.debug('transactionService.transactionPayment -- start');
    if (!transactionDto) {
        logger.warn('transactionService.transactionPayment -- invalid arg(s)');
        throw new BadRequestException('Invalid arg(s)');
    }
    let transactionEntity = mapSaveTransactionToEntity(transactionDto);
    transactionEntity.type = ETransactionType.PAYMENT;
    transactionEntity = await saveTransaction(transactionEntity);
    if (!transactionEntity) {
        logger.warn('transactionService.transactionPayment -- could not save transaction');
        throw new GeneralException();
    }

    const customer = await getCustomerById(transactionDto.customerId);
    if (!customer) {
        logger.warn('transactionService.transactionPayment -- customer not found');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Customer not found',
        });
        throw new NotFoundException('Customer not found');
    }

    if (customer.balance - transactionDto.amount < 0) {
        logger.warn('transactionService.transactionPayment -- insufficient funds');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Insufficient funds',
        });
        throw new ConflictException('Insufficient funds');
    }

    const savedCustomer = await updateCustomerBalance(transactionDto.customerId, -transactionDto.amount);
    if (!savedCustomer || savedCustomer.errors) {
        logger.warn('transactionService.transactionPayment -- could not update customer');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: savedCustomer.errors[0].detail,
        });
        throw new ClientException(savedCustomer.errors);
    }

    transactionEntity = await updateTransaction(transactionEntity.id, { status: ETransactionStatus.SUCCESS });
    logger.debug('transactionService.transactionPayment -- success');
    return transactionEntity;
};

const transactionRefund = async (transactionDto) => {
    logger.debug('transactionService.transactionRefund -- start');
    if (!transactionDto) {
        logger.warn('transactionService.transactionRefund -- invalid arg(s)');
        throw new GeneralException('Invalid arg(s)');
    }

    const refundedTransaction = await findTransactionByIdForRefund(
        transactionDto.transactionId,
        transactionDto.customerId,
    );
    if (!refundedTransaction) {
        logger.warn('transactionService.transactionRefund -- transaction not found');
        throw new NotFoundException('Transaction not found');
    }

    let transactionEntity = mapSaveTransactionToEntity(refundedTransaction);
    transactionEntity.type = ETransactionType.REFUND;
    transactionEntity.relatedTransactionId = refundedTransaction._id;
    transactionEntity = await saveTransaction(transactionEntity);
    if (!transactionEntity) {
        logger.warn('transactionService.transactionRefund -- could not save transaction');
        throw new GeneralException();
    }

    const customer = await getCustomerById(transactionDto.customerId);
    if (!customer) {
        logger.warn('transactionService.transactionRefund -- customer not found');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Customer not found',
        });
        throw new NotFoundException('Customer not found');
    }

    const savedCustomer = await updateCustomerBalance(refundedTransaction.customerId, refundedTransaction.amount);
    if (!savedCustomer || savedCustomer.errors) {
        logger.warn('transactionService.transactionRefund -- could not update customer');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: savedCustomer.errors[0].detail,
        });
        throw new ClientException(savedCustomer.errors);
    }

    const updatedRefundedTransaction = await updateTransaction(refundedTransaction._id, {
        status: ETransactionStatus.REFUNDED,
        refundedTransactionId: transactionEntity._id,
    });
    if (!updatedRefundedTransaction) {
        logger.warn('transactionService.transactionRefund -- could not update refunded transaction');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Could not update refunded transaction',
        });
        throw new GeneralException();
    }

    transactionEntity = await updateTransaction(transactionEntity.id, { status: ETransactionStatus.SUCCESS });
    logger.debug('transactionService.transactionRefund -- success');
    return transactionEntity;
};

const transactionTransfer = async (transactionDto) => {
    logger.debug('transactionService.transactionTransfer -- start');
    if (!transactionDto) {
        logger.warn('transactionService.transactionTransfer -- invalid arg(s)');
        throw new GeneralException('Invalid arg(s)');
    }

    let transactionEntity = mapSaveTransactionToEntity(transactionDto);
    transactionEntity.type = ETransactionType.TRANSFER;
    transactionEntity.toCustomerId = transactionDto.toCustomerId;
    transactionEntity = await saveTransaction(transactionEntity);
    if (!transactionEntity) {
        logger.warn('transactionService.transactionTransfer -- could not save transaction');
        throw new GeneralException();
    }

    const [customer, toCustomer] = await Promise.all([
        getCustomerById(transactionDto.customerId),
        getCustomerById(transactionDto.toCustomerId),
    ]);
    if (!customer || !toCustomer) {
        logger.warn('transactionService.transactionTransfer -- customer not found');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Customer not found',
        });
        throw new NotFoundException('Customer not found');
    }

    if (customer.balance - transactionDto.amount < 0) {
        logger.warn('transactionService.transactionTransfer -- insufficient funds');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: 'Insufficient funds',
        });
        throw new ConflictException('Insufficient funds');
    }

    const savedCustomer = await updateCustomerBalance(transactionDto.customerId, -transactionDto.amount);
    if (!savedCustomer || savedCustomer.errors) {
        logger.warn('transactionService.transactionTransfer -- could not update customer');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: savedCustomer.errors[0].detail,
        });
        throw new ClientException(savedCustomer.errors);
    }

    const savedToCustomer = await updateCustomerBalance(transactionDto.toCustomerId, transactionDto.amount);
    if (!savedToCustomer || savedToCustomer.errors) {
        logger.warn('transactionService.transactionTransfer -- could not update to customer');
        await updateTransaction(transactionEntity.id, {
            status: ETransactionStatus.FAILED,
            description: savedToCustomer.errors[0].detail,
        });
        throw new ClientException(savedToCustomer.errors);
    }

    transactionEntity = await updateTransaction(transactionEntity.id, { status: ETransactionStatus.SUCCESS });
    logger.debug('transactionService.transactionTransfer -- success');
    return transactionEntity;
};

module.exports = {
    getAllPaymentTransactions,
    transactionDeposit,
    transactionPayment,
    transactionRefund,
    transactionTransfer,
};
