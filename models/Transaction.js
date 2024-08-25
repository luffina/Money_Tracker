const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
