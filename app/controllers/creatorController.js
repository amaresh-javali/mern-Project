const User = require('../models/userModel');
const Creator = require('../models/creatorModel');

const creatorCltr = {};

creatorCltr.create = async (req, res) => {
    try {
        const body = req.body;
        const id = req.user._id;
        //const image = req.file;
        body.userId = id; 

        const filter = { _id: id };
        // Find the user by ID and update their role to 'creator';
        const check = await User.findById(id);

        if(check.role === 'user')
        {
            const updatedUser = await User.findOneAndUpdate(filter, { role: 'creator' }, { new: true });
       
            if (!updatedUser) 
            {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create a new Creator instance with the provided data
            const newCreator = new Creator({
                ...body,
                //image: image.filename // Assuming you store the filename in the 'image' field
            });

            // Save the new creator to the database
            const creatorDoc = await newCreator.save();

            res.status(200).json(creatorDoc);
        }
        else
        {
            res.json('You already are a creator!');
        }
    }
    catch (error) 
    {
        res.status(400).json('Failed to create your account');
    }
};

creatorCltr.show = async (req, res) => {
    try {
        const creators = await Creator.find().populate('userId')
        res.status(200).json(creators)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to retrieve creators', message: error.message })
    }
}

creatorCltr.showOne = async (req, res) =>
{
    try
    {
        const id = req.user._id;
        const tempDoc = await Creator.findOne({"userId": id}).populate([{path: 'userId', select: 'username email'}]);
        if(tempDoc.bio)
        {
            res.json(tempDoc)
        }
        else
        {
            res.status(404).json('Error! Please try later!');
        }
    }
    catch(err)
    {
        res.status(400).json(err.message);
    }
}

creatorCltr.update = async (req, res) => {
    console.log('hi');
    try {
        const updatedCreator = await Creator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCreator) {
            return res.status(404).json({ error: 'Creator not found' });
        }

        res.json(updatedCreator);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to update creator' });
    }
};

creatorCltr.delete = async (req, res) => {
    try {
        const deleteCreator = await Creator.findByIdAndDelete(req.params.id);
        
        if (deleteCreator) {
            const deleteUser = await User.findByIdAndDelete(deleteCreator.userId);
            const remainingCreatorDoc = await Creator.find().populate('userId');
            const remainingUserDoc = await User.find();
            if(remainingCreatorDoc && remainingUserDoc)
            {
                res.json({creators: remainingCreatorDoc, users: remainingUserDoc});
            }
        }
        else
        {   
            res.status(404).json({ error: 'creator not found' })
        }
    } catch (err) {
        res.json({ err: 'Failed to delete creator' })
    }
}



creatorCltr.followers = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const creator = await Creator.findById(req.body.creatorId).populate('userId');
        if (creator.followers.some(follower => follower.userId.equals(req.body.userId))) {
            return res.status(403).json({msg:'You already follow this creator'});
        }
        creator.followers.push({ userId: req.body.userId });
        await creator.save()

        res.status(200).json(creator);
    } catch (e) {
        res.json(e.message);
    }
}
creatorCltr.unFollow = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const creator = await Creator.findById(req.body.creatorId).populate('userId');

        const isFollowing = creator.followers.some(
            follower => follower.userId.equals(req.body.userId)
        )
        if (isFollowing) {
            creator.followers = creator.followers.filter(
                follower => !follower.userId.equals(req.body.userId)
            )
            await creator.save();
            return res.status(200).json(creator);
        } else {
            return res.status(404).json({ msg: 'User was not following'});
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json(e.message);
    }
}
module.exports = creatorCltr;
