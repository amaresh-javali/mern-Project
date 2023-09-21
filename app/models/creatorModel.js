const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Add this line to import the Schema object

const creatorSchema = new Schema({
    bio: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        //required: true
    },
    categories: [{
        type: String, 
        required: true
    }],
    socialMedia: {
        linkedin: String,
        facebook: String,
        instagram: String,
        youtube: String,
        twitter: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    followers: [{
        userId:{ 
            type: Schema.Types.ObjectId,
            ref: 'User' 
        },
    }]
});

const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;
