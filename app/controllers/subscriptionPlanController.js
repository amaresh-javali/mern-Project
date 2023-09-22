const SubscriptionPlan = require('../models/subscriptionPlanModel')
// const Creator = require('../models/creatorModel')

const subscriptionCltr = {}
//
subscriptionCltr.create = async(req, res) =>{
    try{
        const body = req.body
        const subscriptionPlan = new SubscriptionPlan(body)

        const savedSubscriptionPlan = await subscriptionPlan.save()
        res.status(200).json(savedSubscriptionPlan)
    }catch(e) {
        res.status(401).json({e: 'error occured while creating Plan'})

    }
}
//get all subScriptionPlans 

// subscriptionCltr.all = async (req, res) =>{
//     try{
//         const  subscriptionPlans = await SubscriptionPlan.find()
//         res.status(200).json(subscriptionPlans)
//     } catch(e) {
//         res.status(401).json({e: error.message})
//     }
// }

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
    //  try{
    //     const id = req.params.id
    //     const plan = await SubscriptionPlan.findByIdAndDelete(id)
    //     if(plan) {
    //         res.json(plan)
    //     } else {
    //         res.status(404).json({})
    //     }
    //  } catch(e) {
    //     res.json(e.message)
    //  }


};


module.exports = subscriptionCltr