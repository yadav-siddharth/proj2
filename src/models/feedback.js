const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    name:{
        type: String
    },

    email:{
        type: String
    },

    subject: {
        type: String
    },

    message:{
        type: String
    }
})

const Feedback = new mongoose.model("Feedback", feedbackSchema)

module.exports = Feedback;