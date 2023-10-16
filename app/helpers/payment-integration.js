const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const Content = require('../models/contentModel');
const SubscriptionPlan = require('../models/subscriptionPlanModel');
const Payment = require('../models/paymentModel');

const paymentController = {};

paymentController.getData = async (request, response)=>
{
    const userId = request.query.userId; 
    const contentId = request.query.contentId; 

    try
    {
        const contentTemp = await Content.findById(new Object(contentId));
        if(contentTemp)
        {
            const planTemp = await SubscriptionPlan.findOne({creatorId: contentTemp.creatorId});
            if(planTemp)
            {
                const resTemp = {
                    userId: userId,  
                    plan: planTemp
                };
                response.json(resTemp);
            }
        }
    }
    catch(err)
    {
        response.status(500).json(err)
    } 
}

paymentController.checkout = async (request, response)=>
{
    const data = request.body;
    const storeItem = data.plan; 

    try
    {
        const newPaymentStatus = new Payment({
            creatorId: storeItem.creatorId,
            userId: data.userId,
            planId: storeItem._id,
            amount: storeItem.amount,
            status: 'pending',
            paymentMethod: 'card',
          });

        const check = await Payment.findOne({creatorId:storeItem.creatorId, userId: data.userId, planId: storeItem._id});

        if(!check)
        {
            const newPaymentDoc = await newPaymentStatus.save(); 
        }

        //Check the logic of this for pending payments. 
        if(check)
        {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'], 
                line_items: [
                    {
                        price_data: {
                            currency: 'inr', 
                            product_data: {
                                name: storeItem.name
                            }, 
                            unit_amount: storeItem.amount * 100
                        }, 
                        quantity: 1
                    },
                ], 
                mode: 'payment', 
                success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CANCEL_URL}?session_id={CHECKOUT_SESSION_ID}`,
                metadata: {
                    userId: data.userId,
                    planId: storeItem._id, 
                    planName: storeItem.name,
                    planAmount: storeItem.amount, 
                    creatorId: storeItem.creatorId
                },
            });
    
            response.json(session);
        }
        else
        {
            response.json('Pending Status.');
        }
    }
    catch(err)
    {
        response.status(500).json({error: err.message});
    };
};

paymentController.getSession = async (request, response)=>
{
    const sessionId = request.query.session_id; 
    const tempId = String(sessionId);

    try
    {
        const sessionInfo = await stripe.checkout.sessions.retrieve(tempId);
        response.json(sessionInfo);
    }
    catch(err)
    {
        response.status(500).json(err.message);
    }
}

module.exports = paymentController; 
