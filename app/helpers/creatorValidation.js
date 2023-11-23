const Creator = require('../models/creatorModel');

const creatorValidationSchema = {
    bio: {
        notEmpty: {
            message : 'Bio is required'
        }
    },
    categories: {
        notEmpty: {
            message : 'Categories cannot be empty!'
        }
    }
};

module.exports = creatorValidationSchema; 
