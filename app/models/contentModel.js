const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import the Schema object
// const Creator = require('../models/creatorModel');

const contentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },
    likes: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
           
        }
    ],
    comments: [
        {
            body: String,
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            postId:{
                type:Schema.Types.ObjectId,
                ref:'Content'
            }
        }
    ],
    isVisible: 
        {
            type: Boolean,
            default:true
        }
    ,
    fileType:{
        type:String,
        required:true
    }
    
}, {timestamps: true});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;