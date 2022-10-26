const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
    fname:{
        type: String,
    },

    email:{
        type: String
    },

    number:{
        type: Number
    },

    address:{
        type: String
    }

})

const Userprofile = new mongoose.model("Userprofile", userProfileSchema);
module.exports =Userprofile;
