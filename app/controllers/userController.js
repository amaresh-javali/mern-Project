const { pick } = require('lodash');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const usersCtrl = {};

usersCtrl.register = async (req, res) => {
    try {
        const body = pick(req.body, ['username', 'email', 'password']);

        if (!validator.isStrongPassword(body.password)) 
        {
            return res.status(400).json({ error: 'Password requirements not met' });
        }

        const check = await User.findOne({email: body.email});

        if(body.email === 'rishav@gmail.com')
        {
            body.role = 'admin';
        };

        if(!check)
        {
            const user = new User(body)
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;

            const userDoc = await user.save();
            res.json(userDoc);
        }
        else
        {
            res.json({error: 'This Email is already registered!'});
        }
    } 
    catch (error) 
    {
        res.status(500).json({ error: 'Internal server error' });
    }
};

usersCtrl.login = async (req, res) => {
    try {
        const body = pick(req.body, ['email', 'password']);
        const user = await User.findOne({ email: body.email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const result = await bcrypt.compare(body.password, user.password);

        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokenData = { _id: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET);

        res.json({ token: `Bearer ${token}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

usersCtrl.account = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(pick(user, ['_id', 'username', 'email', 'role']));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

usersCtrl.getAllUsers = async (req, res) => {
    try {
        // Retrieve all users from the database
        const allUsers = await User.find({users: req.params.id});

        res.json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

usersCtrl.delete = async (request, response)=>
{
    try
    {
        const deleteId = request.params.id; 
        
        const deleteDoc = await User.findByIdAndDelete(deleteId);
        if(!deleteDoc)
        {
            response.status(404).json('No Such Document to delete !');
        }
        
        const remainDocs = await User.find();
        response.json(remainDocs);
    }
    catch(err)
    {
        console.log(err.message);
        response.json(err.message);
    }
}

module.exports = usersCtrl;
