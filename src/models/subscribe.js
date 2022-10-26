const mongoose = require('mongoose')

const subscription = new mongoose.Schema({
    email:{
        type: String,
        // unique: True,
    },

    subscription: {
        type: String
    }
})

const Subscription = new mongoose.model("Subscription", subscription)

module.exports = Subscription;