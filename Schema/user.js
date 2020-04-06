const mongoose = require('mongoose');
const schema = mongoose.Schema

const User = new schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports =mongoose.model('User', User)