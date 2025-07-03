const mongoose = require('mongoose')
const { stringify } = require('querystring')

//schema design
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required and should be unique'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true })

//export
const userModel = mongoose.model('users', userSchema)
module.exports = userModel