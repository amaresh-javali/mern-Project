const { Schema } = require('mongoose')
const Content = require('../models/contentModel')
// const User = require('../models/userModel')
const contentCltr = {}

// create a content
contentCltr.create = async (req, res) => {
  try {
    const { title, creatorId, body, type, isVisible } = req.body;
    const fileType = req?.file

    const createContent = new Content({ title, body, creatorId: creatorId, isVisible, type, fileType: fileType.location });
    const postContent = await createContent.save()
    res.json(postContent);
  } 
  catch (error) 
  {
    res.json(error)
  }
}


// get all content
contentCltr.showAll = async (req, res) => {
  try {
    const contents = await Content.find({}).populate({
      path: "creatorId",
      model: "User",
      select: 'username email'
    });
    // console.log(contents)
    res.status(200).json(contents)
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve content', message: error.message })
  }
}

contentCltr.update = async (req, res) => {
  try {
    const updateContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    console.log('hi')
    if (updateContent) {
      res.status(200).json(updateContent)
    }
  } catch (error) {
    res.json({ error: 'Failed to update content', message: error.message })
  }
}

// delete a content

contentCltr.contentDelete = async (req, res) => {
  try {
    const id = req.params.id
    deleteContent = await Content.findByIdAndDelete(id)
    res.json({ deleteContent, message: 'content deleted successfully' })
  } catch (e) {
    console.log(e.message)
  }
}

contentCltr.deleteContent = async (request, response)=>
{
  try
  {
    contentId = request.params.id; 
    const deleteDoc = await Content.findByIdAndDelete(contentId);
    if(!deleteDoc)
    {
      response.status(500).json('There is no such Content!');
    }
    else
    {
      const remainingDocs = await Content.find();
      response.json(remainingDocs);
    }
  }
  catch(err)
  {
    response.status(404).json('Error while Deleting the Content!');
  }
}

contentCltr.addLike = async (req, res) => {
  try {
    console.log(req.body, 'body')
    const contentId = req.body.postId
    const userId = req.user._id
    const content = await Content.findById(contentId)
    if (!content) {
      return res.status(404).json({ message: 'Content not found' })
    }
    // Add the like
    content.likes.push({ userId })
    await content.save()

    res.status(200).json({ message: 'Like added successfully', content })

  } catch (e) {
    console.log(e, 'message')
    res.json(e.mesage)
  }
}
contentCltr.removeLike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id
  try {
    // Find the post by postId
    const post = await Content.findByIdAndUpdate(postId, { $pull: { likes: { userId: userId } } }, { new: true });
    return res.json({ message: "Like removed successfully", post });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

contentCltr.comment = async (req, res) => {
  console.log(req.body)
  try {
    const { contentId, body } = req.body;
    const userId = req.user._id
    const content = await Content.findOne({ _id: contentId });
    console.log(content, ' content')
    const newComment = {
      body,
      userId,
      postId: contentId,
    };
    console.log(newComment, 'new comment')
    content.comments.push(newComment);
    const comDoc = await content.save();
    console.log(comDoc)
    res.status(200).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

contentCltr.delete = async (req, res) => {
  try {
    const contentId = req.params.contentId;
    const commentId = req.params.commentId
    // Find the content item containing the comment
    const content = await Content.findOne({ _id: contentId, 'comments._id': commentId });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    const updatedContent = await Content.findOneAndUpdate(
      { _id: contentId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.status(200).json({ updatedContent, message: 'Comment deleted successfully' });
  } catch (error) {
    console.log('hi dis is catch block')
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = contentCltr