const User = require('../models/userModel')

const usernameSchema = {
    notEmpty: {
        errorMessage: 'username is required'
    }
}
const passwordSchema = {
    notEmpty: {
        errorMessage: 'password is required'
    },
    isLength: {
        option: { min: 8, max: 128 },
        errorMessage: 'password should be  between 8 - 128 characters'
    }
}
const emailRegisterSchema = {
    notEmpty: {
        errorMessage: 'email is required'
    },
    isEmail: {
        errorMessage: 'invalid email formate'
    },
    custom: {
        options: async (value) => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error('email already present')
            } else {
                return true
            }
        }
    }
}


const emailLoginSchema = {
    notEmpty: {
        errorMessage: 'email is required'
    },
    isEmail: {
        errorMessage: ' invalid email formate'
    }
}

const userRegisterValidationSchema = {
    username: usernameSchema,
    email: emailRegisterSchema,
    password: passwordSchema
}

const userLoginValidationSchema = {
    email: emailLoginSchema,
    password: passwordSchema
}

module.exports = {
    userRegisterValidationSchema,
    userLoginValidationSchema
}