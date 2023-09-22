const Subscribers = require('../models/subscribersModel')
const User = require('../models/userModel')
// const Creator = require ('../models/creatorModel')

const subscribersCltr = {}

subscribersCltr.subscribe = async(req, res) =>{
    try{
        const body = req.body
        const newSubscribers = await Subscribers(body)
        await newSubscribers.save()
        res.status(200).json({newSubscribers, msg:'subScribed successfully'})
    }catch(e) {
        res.json(e.message)
    }
}

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