const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Creator = require('./creatorModel');

const subscriptionPlanSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    creatorId: {
        type:Schema.Types.ObjectId,
        ref: 'Creator', // Use the string 'Creator' here
        required: true
    }
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
