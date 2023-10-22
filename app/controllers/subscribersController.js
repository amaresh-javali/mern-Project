const Subscribers = require('../models/subscribersModel');
const Creator = require('../models/creatorModel');
// const Creator = require ('../models/creatorModel')

const subscribersCltr = {}

//get subscribers of a particular creator. Work.
subscribersCltr.getSubscribers = async (request, response)=>
{
	try
	{
		const id = request.user._id; 
		const temp = await Creator.findOne({userId: id});
		const resultTemp = await Subscribers.findOne({creatorId:temp._id});
		response.json(resultTemp);
	}
	catch(err)
	{
		response.status(404).json(err);
	}
}

//to subscribe to a creator. Done, don't change un-till discussed.
subscribersCltr.subscribe = async (request, response) => {
    const { creatorId, planId, userId } = request.body;

    try 
	{
        const temp = await Subscribers.findOne({ creatorId: creatorId, planId: planId });

        if(temp) 
		{
            const check = temp.subscribers.some((subs) => 
			{
                return subs.userId.equals(userId);
            });

            if(check) 
			{
                response.json('Already subscribed!');
            } 
			else 
			{
                const tempDoc = await Subscribers.findOneAndUpdate(
                    { creatorId: creatorId, planId: planId },
                    { $push: { subscribers: { userId: userId } } },
                    { new: true, runValidators: true }
                );
                response.json(tempDoc);
            }
        } 
		else 
		{
			const subscribersData = {
                creatorId: creatorId,
                planId: planId,
                subscribers: [{ userId: userId }],
            };

            const newSubscribers = new Subscribers(subscribersData);
            const tempDoc = await newSubscribers.save();
            response.json(tempDoc);
        }
    } 
	catch (err) 
	{
        response.status(500).json(err.message);
    }
};

//to un-subscribe from a user. Work.
subscribersCltr.unSubscribe = async (req, res) => {
  const subscriberId = req.body.id;
  const userId = req.body.userId; // Assuming req.body.userId contains a valid user ID

  try {
    const result = await Subscribers.findByIdAndUpdate(
      subscriberId,
      {
        $pull: { subscribers: { userId: userId } }
      },
      { new: true }
    );

    // if (!result) {
    //   return res.status(404).json({ message: 'Subscriber not found.' });
    // }

    res.json({ subscriber: result, message: 'User unsubscribed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while unsubscribing the user.' });
  }
}

module.exports = subscribersCltr