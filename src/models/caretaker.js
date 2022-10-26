const mongoose = require('mongoose')

const caretakerSchema = new mongoose.Schema({
    email:{
        type: String,
    },

    fname:{
        type: String,
    },

    lname:{
        type: String,
    },

    gender:{
        type: Number,
    },

    age:{
        type: Number,
    },

    experience:{
        type: Number,
    },

    charge:{
        type: String
    },

    slot: [{
        type: String
    }],

    password:{
        type: String
    }

})

const Caretaker = new mongoose.model("Caretaker", caretakerSchema);
module.exports = Caretaker;

