const mongoose = require('mongoose')
const schema = mongoose.Schema

const Logs = new schema({
    user_name: { 
        type: String 
    },
    country: {
        type: String,
        required: true
    },
    place_name: {
        type: String,
        required: true
    },
    place_discription: {
        type: String
    },
    rating: {
        type: Number,
        max: 5,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    images:[String]
})

module.exports = mongoose.model('Logs', Logs)