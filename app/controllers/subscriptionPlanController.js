const SubscriptionPlan = require('../models/subscriptionPlanModel')
const Creator = require('../models/creatorModel')

const subscriptionCltr = {};

//Creating subscriptions.
subscriptionCltr.create = async(req, res) =>{
    try{
        const body = req.body;

        const valid = await Creator.findOne({_id: body.creatorId});
        const count = await SubscriptionPlan.find({creatorId: body.creatorId});
        
        if(valid)
        {
            if(count.length === 0)
            {
                const subscriptionPlan = new SubscriptionPlan(body)
                const savedSubscriptionPlan = await subscriptionPlan.save()
                res.status(200).json(savedSubscriptionPlan);
            }
            else 
            {
                res.json('You have already created a plan. You can either update existing plan or delete it.');
            }
        }
        else
        {
            res.json('You are not a creator ! Become one, then add plans.');
        }
    }
    catch(e) 
    {
        res.status(401).json(e);
    }
}

//Get particular users' subscription plans.
subscriptionCltr.showPlan = async (request, response)=>
{
    try
    {
        const id = request.user._id; 
        const userTemp = await Creator.findOne({userId: id});
        const creatorId = userTemp._id
        const subscribePlanTemp = await SubscriptionPlan.findOne({creatorId: creatorId});
        response.json(subscribePlanTemp);
    }
    catch(err)
    {
        response.status(400).json(err.message);
    }
}

//Update existing subscription plans.
subscriptionCltr.update = async(req, res) =>{
    try{
        const { name, amount } = req.body
        const id = req.params.id
        // console.log(id)

        const updateSubscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(
            id,
            {name, amount},
            {new: true}
        )
        // console.log(updateSubscriptionPlan)
        if(updateSubscriptionPlan) {
            res.status(200).json(updateSubscriptionPlan)
            console.log(updateSubscriptionPlan)
        }
        res.status(401).json({e:'error occure while update plan'})
        
    }catch(e){
        res.status(400).json({error: 'subscription plan not found'})

    }
}

//Delete existing plans. 
subscriptionCltr.delete = async (req, res) => {
    try {
        const id = req.params.id; // Retrieve subscriptionPlanId from URL parameters
        // console.log(id)
        const plan = await SubscriptionPlan.findByIdAndDelete(id);
        console.log(plan)
        // if (!deleteSubscriptionPlan) {
        //     res.status(400).json({ error: 'Subscription plan not found' });
        // } else {
        //     res.status(200).json({ deleteSubscriptionPlan, message: 'Subscription plan deleted successfully' }); // 204 status for successful deletion
        // }
        if(!plan) {
            res.status(404).json({e:'plan not found' });
        } else {
            res.status(200).json(plan)
        }
    } catch (e) {
        res.json(e.message)
    }
};


module.exports = subscriptionCltr