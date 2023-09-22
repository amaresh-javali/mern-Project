const mongoose = require('mongoose');
const Schema = mongoose.Schema
const subscribersSchema = new Schema({
    creatorId: {
        type:Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },
    planId: {
        type:Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true
    },
    subscribers: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
});

const Subscribers = mongoose.model('Subscribers', subscribersSchema);

module.exports = Subscribers;
