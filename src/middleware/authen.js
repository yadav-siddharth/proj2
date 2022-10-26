const jwtoken = require('jsonwebtoken')
const Registered = require('../models/registers')

const authen = async(req, res, next) =>{
    try {
        const token = req.cookies.jwtoken;
        const verifyUser = jwtoken.verify(token, process.env.SECRET_KEY);
        
        const user = await Registered.findOne({_id:verifyUser._id})
        // console.log(verifyUser);
        // console.log(user);
        
        next();
    } catch (error) {
        res.status(401).redirect('/l')
    }
}

module.exports = authen;