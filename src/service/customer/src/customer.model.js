const mongoose = require('mongoose');

const CustomerModel = mongoose.Schema(
    {
        firstName: {
            type: String,
            minlength: 3,
            maxlength: 256,
            required: true,
        },
        lastName: {
            type: String,
            minlength: 3,
            maxlength: 256,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        balance: {
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('customers', CustomerModel);
