const Env = Object.freeze({
    PORT: 'PORT',
    NODE_ENV: 'NODE_ENV',

    DB_HOST: 'DB_HOST',
    DB_NAME: 'DB_NAME',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
});

const ETransactionStatus = Object.freeze({
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
});

const ETransactionType = Object.freeze({
    DEPOSIT: 'DEPOSIT',
    TRANSFER: 'TRANSFER',
    REFUND: 'REFUND',
    PAYMENT: 'PAYMENT',
});

module.exports = {
    Env,
    ETransactionStatus,
    ETransactionType,
};
