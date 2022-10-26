const mongoose = require('mongoose')

const ctinfoSchema = new mongoose.Schema({
    email:{
        type: String,
    },

    slot: [{
        type: String
    }],

    charge:{
        type: String
    },

    

})

const Ctinfo = new mongoose.model("Ctinfo", ctinfoSchema);
module.exports = Ctinfo;

