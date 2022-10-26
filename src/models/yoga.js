const mongoose = require('mongoose')

const yoga = new mongoose.Schema({
    fname:{
        type:String
    },

    lname:{
        type: String
    },

    email:{
        type: String,
    },

    phone: {
        type: Number
    }
})

const Yoga = new mongoose.model("Yoga", yoga)

module.exports = Yoga;