const Content = require('../models/contentModel')
// const User = require('../models/userModel')
const contentCltr = {}

// create a content
contentCltr.create = async(req, res) =>{
    try{
        const body = req.body
        const content = req.file
        const type = content.mimetype.startsWith('image') ? 'image' : 'video'
        const createContent = new Content({...body, type, path: content.filename})
        const postContent = await createContent.save()
        res.json(postContent)
        // const newContent = new Content(body)
        // const contentDoc = await newContent.save()
        // res.status(200).json(contentDoc)
    }catch(error) {
        res.status(400).json(({error: 'Failed to create content', message: error.message}))
    }
}

// get all content
contentCltr.showAll = async(req, res) =>{
    try {
        const contents = await Content.find()
        res.status(200).json(contents)
    } catch(error) {
        res.status(400).json({error:'Failed to retrive content', message: error.message})
    }
}
// get a single content
contentCltr.showOne = async(req, res) =>{
    try{
        const content = await Content.findById(req.params.id)
        if(!content){
            return res.status(404).json({error: 'content not found'})
        } 
        res.status(200).json(content)
    } catch(error) {
        res.status(400).json(error)
    }
}
//update a content
contentCltr.update = async(req, res) =>{
    try{
        const updateContent = await Content.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true, runValidators:true}
        )
        if(updateContent){
            res.status(200).json(updateContent)
        }
    } catch(error) {
        res.json({error:'Failed to update content', message:error.message})
    }
}
// delete a content
contentCltr.delete = async (req, res) =>{
    try{
        const deleteContent = await Content.findByIdAndDelete(req.params.id)
        if(deleteContent) {
            return res.status(200).json({message:'content deleted successfully'})
        } 
    } catch(e) {
        res.status(400).json({e: 'Failed to delete content'})
    }
}
// adding a like to specific content 
// contentCltr.likes = async(req, res) =>{
//     try{
//         const userId = req.body._id
//         if(res.content.likes.some(like => like.id.equals(userId))){
//             return res.staus(400).json({message:'User has already liked content'})
//         }
//        const addLike = await Content.updateOne(
//             {_id:res.content._id},
//             {$push: {likes:{userId}}}
//         )
//         res.json(addLike)
//     } catch(e) {
//         res.status(400).json({message: e.message})
//     }
// }

// remove a like to specific content
contentCltr.addLike = async(req, res) =>{
    const { userId, postId } = req.body
    console.log(userId)

    try {
        // Find the post by postId
        const post = await Content.findById(postId);
        // console.log(post)

        // if (!post) {
        //     return res.status(404).json({ error: "Post not found" });
        // }
        // const userId = userId.id
        // console.log(userId)

        // Check if the user has already liked the post
        // const existingLike = post.likes.find(like => like.userId.equals(userId));
        // if (existingLike) {
        //     return res.status(409).json({ message: "User has already liked the post" });
        // }

        // Add the like
        post.likes.push({ userId });
        // console.log(post.likes)

        // Save the updated post
        await post.save();

        return res.json({ message: "Post liked successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server " });
    }
}
 



//create a new comment

contentCltr.removeLike = async (req, res) => {
    const { userId, postId } = req.body;
    console.log(userId)
    try {
        console.log("Received request with userId:", userId);
        console.log("Received request with postId:", postId);

        const post = await Content.findById(postId);
        console.log("Retrieved post from the database:", post.likes);
        // Use the filter method to create a new array without the like
        post.likes = post.likes.filter(like => like.userId.equals(userId));

        console.log("Post after removing like:", post.likes);

        await post.save();
        console.log("Post saved successfully");

        return res.json({ message: "Post like removed successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



contentCltr.comment = async(req, res) =>{
    try{
        const contentId = req.body.contentId
        const { body, userId } = req.body

        const content = await Content.findById(contentId)
        if(!content) {
            return res.status(404).json({message: 'Content not found'})
        }
        const newComment = {
            body,
            userId,
            postId: contentId
        }
        content.comments.push(newComment)
        await content.save()
        res.status(200).json({message: 'comment added successfully', comment: newComment})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}



contentCltr.delete = async (req, res) => {
    try {
        const contentId = req.params.contentId;
        const commentId = req.params.commentId;

        // Find the content item containing the comment
        const content = await Content.findOne({ _id: contentId, 'comments._id': commentId });

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Use the arrayFilters option to target the specific comment to be removed
        const updatedContent = await Content.findOneAndUpdate(
            { _id: contentId },
            { $pull: { comments: { _id: commentId } } },
            { new: true, arrayFilters: [{ 'comment._id': commentId }] }
        )

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};










 


module.exports = contentCltr