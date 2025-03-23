const mongoose = require('mongoose');
const { ETransactionStatus, ETransactionType } = require('../../../enums');

const TransactionModel = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        toCustomerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
        },
        relatedTransactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(ETransactionStatus),
            required: true,
            default: ETransactionStatus.PENDING,
        },
        type: {
            type: String,
            enum: Object.values(ETransactionType),
            required: true,
        },
        description: {
            type: String,
            // required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('transactions', TransactionModel);
