const mongoose = require('mongoose');
const {Schema} = mongoose;

const paymentSchema = new mongoose.Schema({
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },
    planId: {
        type:Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true, 
        default: 'card'
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
