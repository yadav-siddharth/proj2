const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require("../db/conn");
const Registered = require("../models/registers")

// router.get('/', (req, res) => {
//     res.render('home')
// })


//using promises

// router.post('/register', (req, res)=>{
//     const {name, email, password} = req.body;

//     if(!name || !email || !password){
//         return res.status(422).json({message: "Fill all the fields"})
//     }

//     Registered.findOne({email: email})   //database: user entered
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({message: "Email already exists"})
//         }

//         const user = new Registered({name: name, email: email, password: password});

//         user.save().then(()=>{
//             res.status(201).json({message: "User registered successfully"})
//         }).catch((err)=>{
//             res.status(500).json({error: "Failed to register"})
//         })
//     }).catch((error)=>{
//         console.log(error);
//     })

// })



router.post('/register', async (req, res) => {
    // const { name, email, password } = req.body;
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if (!name || !email || !password) {
        if(!name)
            console.log("Name not filled");

            if(!email)
            console.log("Email not filled");

            if(!password)
            console.log("Password not filled");
        return res.status(422).json({ message: "Fill all the fields" })
    }

    try {
        const userExist = await Registered.findOne({ email: email })   //database: user entered

        if (userExist) {
            return res.status(422).json({ message: "Email already exists" })
        }

        const user = new Registered({ name: name, email: email, password: password });

        const userRegister = await user.save()

        if (userRegister) {
            res.status(201).json({ message: "User registered successfully" })
        }
        else {
            res.status(500).json({ error: "Failed to register" })

        }

    } catch (error) {
        console.log(error);
    }

})




//login route
// router.post('/l', async (req, res) => {
//     // console.log(req.body);
//     // res.json({message: "awesome"})

//     try {
//         let token;
//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({ error: "plz fill" })
//         }

//         const userLogin = await Registered.findOne({ email: email });

//         if (userLogin) {
//             const isMatch = await bcrypt.compare(password, userLogin.password)

//             token = await userLogin.generateAuthToken();
//             // console.log(token);

//             res.cookie("jwtoken",  token, {
//                 expires: new Date(Date.now() + 25892000000),     //30days
//                 httpOnly: true

//             })

//             if (!isMatch) {
//                 res.status(400).json({ error: "Invalid credentials" })
//             } else {
//                 res.json({ message: "User Signed In Successfully" })
//             }
//         } else {
//             res.status(400).json({ error: "Invalid credentials" })

//         }


//     } catch (error) {
//         console.log(error);
//     }
// })

module.exports = router;