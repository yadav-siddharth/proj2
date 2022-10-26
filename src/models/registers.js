// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     name:{
//         type: String,
//         required: true
//     },

//     email:{
//         type: String,
//         required: true
//     },

//     password:{
//         type: String,
//         required: true
//     }
// })

// const Registered  = new mongoose.model("Register", userSchema)

// module.exports = Registered;




const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        // required: true
    },

    email:{
        type: String,
        // required: true
    },

    password:{
        type: String,
        // required: true
    },

    tokens:[
        {
             token:{
                type: String,
                // required: true
             }
        }
    ],

    image:{
        type: String
    },

    subscription:{
        type: String
    },

    ctName:{
        type: String
    },

    slot: [{
        type: String
    }]


})

//hashing a password
userSchema.pre('save', async function(next){
    // console.log("hi from inside");
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    
    next();
})

//generating token
userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token
    } catch (error) {
        console.log(error);
    }
}

const Registered  = new mongoose.model("Register", userSchema)

module.exports = Registered;