const User = require('../models/userModel');
const jwt = require ('jsonwebtoken');

const authorization = async (req, res, next) => 
{
    try
    {
        const id = req.user._id; 
        const adminUser = await User.findById(id);
        if(adminUser && adminUser.role === 'admin')
        {
            next();
        }
        else
        {
            res.status(403).json('Access Denied');
        }
    } 
    catch (err) 
    {
        res.status(500).json('Error while Performing Action!');
    }
};


module.exports = authorization;