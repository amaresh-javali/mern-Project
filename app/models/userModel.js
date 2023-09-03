const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,      
    },
    role:{ 
        type: String,
        required: true,
        enum: ['user', 'creator'],
        default: 'user'
    }
})

userSchema.plugin(uniqueValidator)
const User = mongoose.model('User', userSchema)
module.exports = User