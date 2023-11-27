const Content = require('../models/contentModel')

const contentValidation = {
    title: {
        notEmpty: {
            errorMessage: 'title is required'
        }
    },
    body: {
        notEmpty: {
            errorMessage: 'body is required'
        }
    },
    type: {
        notEmpty: {
            errorMessage: 'type is required'
        }
    },
    category: {
        notEmpty: {
            errorMessage: 'category name is required'
        }
    },
    fileType: {
        notEmpty: {
            errorMessage: 'fileType is required'
        }
    }
}

module.exports = contentValidation