const Payment = require('../models/paymentModel');

const paymentStatusController = {};

paymentStatusController.updateStatus = async (request, response)=>
{   
    const {creatorId, planId, userId, status} = request.body; 

    try
    {
        const tempDoc = await Payment.findOneAndUpdate({planId:planId, creatorId: creatorId, userId: userId}, {status:status}, {new: true, runValidators: true});
        response.json('Success Payment');
    }
    catch(err)
    {
        response.status(500).json(err);
    };

};

module.exports = paymentStatusController; 
