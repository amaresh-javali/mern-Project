const User = require('../models/userModel');
const Creator = require('../models/creatorModel');

const creatorCltr = {};

creatorCltr.create = async (req, res) => {
    try {
        const body = req.body;
        console.log('Request Body:', body);
        const id = req.user._id;
        //const image = req.file;
        console.log(id);
        body.userId = id; 

        const filter = { _id: id };
        // Find the user by ID and update their role to 'creator'
        const updatedUser = await User.findOneAndUpdate(filter, { role: 'creator' }, { new: true });
        console.log(updatedUser, "updatedUser")
       
        if (!updatedUser) {
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
    catch (error) 
    {
        console.error(error);
        res.status(400).json('Failed to create your account');
    }
};

creatorCltr.show = async (req, res) => {
    try {
        const creators = await Creator.find()
        res.status(200).json(creators)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to retrieve creators', message: error.message })
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
        const deleteCreator = await Creator.findByIdAndDelete(req.params.id)
        if (deleteCreator) {
            return res.json({ message: 'creator deleted successfully' })
        }
        res.status(404).json({ error: 'creator not found' })
    } catch (err) {
        res.json({ err: 'Failed to delete creator' })
    }
}

// creatorCltr.followers = async (req, res) => {
//     try {
//         const user = await User.findById(req.body.userId)
//         const creator = await Creator.findById(req.body.creatorId)
//         console.log(user)
//         console.log(creator)

//         // if(!user || !creator) {
//         //     res.json({msg: 'User or Creator not found'})
//         // }
//         // if(!creator.followers.includes(user.id)){
//         //     creator.followers.push({userId:user.id})
//         //     creator.save()
//         //     res.status(200).json({msg: 'User started following successfully'})
//         // } else {
//         //     res.json({msg: 'User is already following'})
//         // }
//         creator.followers.push({ userId: user._id })
//         await creator.save()
//         res.json(creator)
//     } catch (e) {
//         res.json(e)
//     }
// }

creatorCltr.followers = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const creator = await Creator.findById(req.body.creatorId);
        if (creator.followers.some(follower => follower.userId.equals(user._id))) {
            return res.status(401).json({ msg: 'User is already following' });
        }
        // Add the follower only if not already following
        creator.followers.push({ userId: user._id });
        await creator.save();
        
        res.status(200).json({ msg: 'User started following successfully' });
    } catch (e) {
        res.json(e.message);
    }
}
creatorCltr.unFollow = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const creator = await Creator.findById(req.body.creatorId);

        const isFollowing = creator.followers.some(
            follower => follower.userId.equals(user._id)
        )
        if (isFollowing) {
            console.log('User is following');
            // Remove the user from the followers list
            creator.followers = creator.followers.filter(
                follower => !follower.userId.equals(user._id)
            )
            await creator.save();
            // console.log('User removed from followers');
            return res.status(200).json({ msg: 'User unfollowed successfully' });
        } else {
            // console.log('User was not following');
            return res.status(404).json({ msg: 'User was not following' });
        }
    } catch (e) {
        res.status(400).json(e.message);
    }
}
module.exports = creatorCltr;
