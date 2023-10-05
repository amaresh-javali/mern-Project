const Subscribers = require('../models/subscribersModel')
const User = require('../models/userModel');
const Creator = require('../models/creatorModel');
// const Creator = require ('../models/creatorModel')

const subscribersCltr = {}

//get subscribers of a particular creator. 
subscribersCltr.getSubscribers = async (request, response)=>
{
	try
	{
		const id = request.user._id; 
		const temp = await Creator.findOne({userId: id});
		const resultTemp = await Subscribers.find(temp._id);
		response.json(resultTemp);
	}
	catch(err)
	{
		response.status(404).json(err);
	}
}

//to subscribe to a creator. 
subscribersCltr.subscribe = async(req, res) =>
{
    try
	{
        //we need creatorID, & his planID. Then we add the user who wants to subscribe. This will be updated after the payment if done. This is the right way to handle it. 
		const temp = await Subscribers.findOne({creatorId: creatorId});
    }
	catch(err) 
	{
        res.status(404).json(err)
    }
};

//to un-subscribe from a user. 
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