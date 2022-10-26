const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const ejs = require('ejs')
const flash = require('connect-flash')
const body_parser = require('body-parser')
require('./db/conn')
const Registered = require('../src/models/registers')
const Employee = require('../src/models/employee')
const Subscription = require('../src/models/subscribe')
const Healthcheckup = require('../src/models/healthCheckup')
const Caretaker = require('../src/models/caretaker')
const Ctinfo = require('../src/models/ctinfo')
const Userprofile = require('../src/models/userProfile')
const Feedback = require('../src/models/feedback')
const Yoga = require('../src/models/yoga')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 8000;
// const router = require('./router/auth')
dotenv.config({ path: '../config.env' })
const bcrypt = require('bcryptjs');
const authen = require('./middleware/authen')
var multer = require('multer')
const nodemailer = require('nodemailer');
const { rmSync } = require('fs')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'abhishekshirke502@gmail.com',
        pass: 'mwaakgtlxlvobdte'
    }
});




const app = express();

const staticpath = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const img_path = path.join(__dirname, "../uploads")
// const partialspath = path.join(__dirname, "../templates/partials")

app.use(express.json());
// app.use(require('./router/auth'))
app.use(express.static(staticpath))
app.use(express.static(img_path))
// app.use('../uploads', express.static('uploads'));
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(cookieParser())
// app.use(express.urlencoded({extended:false}))     //use to get the input from form
app.use(flash());
app.use(express.json())


app.set('view engine', "ejs")
app.set("views", template_path)
// ejs.registerPartials(partialspath)


app.get('/', (req, res) => {
    res.render('home', {name: req.cookies.name})
})

app.get('/register', (req, res) => {
    res.render('reg')
})

app.get('/about', authen, (req, res) => {
    // console.log(`${req.cookies.jwtoken} is a cookie`);
    res.render('about')
})


// var users;
app.post('/register', async (req, res) => {
    // const { name, email, password } = req.body;
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if (!name || !email || !password) {
        return res.status(422).render('reg', { fields: "*Fill all the fields" })
    }

    if(name.length < 4){
        return res.render('reg', {fields: "*Username is too short"});
    }

    if(password.length < 4){
        return res.render('reg', {fields: "*Password is too short"});
    }

    try {
        const userExist = await Registered.findOne({ email: email })   //database: user entered

        if (userExist) {
            return res.render('reg', { message: "*Email already exists" })
        }

        const user = new Registered({ name: name, email: email, password: password });

        const userRegister = await user.save()

        if (userRegister) {
            res.status(201).render('login')
        }
        else {
            res.status(500).render('reg', { error: "Failed to register" })

        }

    } catch (error) {
        console.log(error);
    }

})



app.get('/l', (req, res) => {
    res.render('login')
})



//login
app.post('/l', async (req, res) => {
    // console.log(req.body);
    // res.json({message: "awesome"})

    try {
        let token;
        const { name, email, password } = req.body;

        // if(name=="admin" && email=="admin@gmail.com" && password=="admin"){
        //     return res.render("admin");
        // }


        if (!name || !email || !password) {
            return res.status(400).render('login', { fields: "*Fill all the fields" })
        }

        const userLogin = await Registered.findOne({ email: email });
        const e = await Subscription.findOne({ email: email });

        if (userLogin) {
            if (e) {
                res.cookie("sub", e.subscription);
                // console.log(e.subscription);
            }
            const isMatch = await bcrypt.compare(password, userLogin.password);


            token = await userLogin.generateAuthToken();
            // console.log(token);

            res.cookie("email", email)
            res.cookie("name", name)

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),     //30days
                httpOnly: true

            })


            if (!isMatch) {
                res.status(400).render('login', { wrong: "*Invalid credentials" })
                // res.json({message: "Invalid credentials"})
            } else {
                // res.json({ message: "User Signed In Successfully" })
                // res.redirect('/')
                // console.log(req.cookies); 
                res.redirect('/');
            }
        } else {
            res.status(400).render('login', { error: "*Invalid credentials" })

        }


    } catch (error) {
        console.log(error);
    }
})

//logout
app.get('/logout', (req, res) => {
    // console.log(`this is logout page`);
    res.clearCookie("jwtoken");
    res.clearCookie("email");
    res.clearCookie("sub");
    res.clearCookie("name");
    res.status(200).redirect('/')
})

//user's profile
var imgName = "";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
        imgName = file.originalname;
    }
})
// console.log(imgName);
var upload = multer({ storage: storage })

app.get('/profile', authen, (req, res) => {
    res.render('profile')
})

app.post('/profile', upload.single('profile-file'), async (req, res) => {
    try {
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email;
        const address = req.body.address;
        const pincode = req.body.pincode;

        const userExist = await Userprofile.findOne({ email: email })   //database: user entered

        if (userExist) {
            // return res.render('profile',{ message: "*Profile exists." })
            return res.render('profile2', { message: `${fname}.jpg`, name: `${fname} ${lname}`, email: `${email}`, address: `${address}` });
        }

        const user = new Userprofile({ fname: fname, lname: lname, email: email, address: address, pincode: pincode });

        const userRegister = await user.save()

        // var response = '<a href="/">Home</a><br>'
        // response += "Files uploaded successfully.<br>"
        // let path = '/graphs2.jpg'
        // response += `<img style="width: 500px;" src="${imgName}" /> <br>`
        // return res.send(response)
        return res.render('home');
    }
    catch (err) {
        res.send(err);
    }
})


//employee
app.get('/creg', (req, res) => {
    res.render('creg')
})



app.post('/creg', async (req, res) => {
    const { fname, lname, email, password, gender, age, experience } = req.body;

    if (!fname || !lname || !email || !password || !gender || !age || !experience) {
        return res.status(422).render('creg', { fields: "*Fill all the fields" })
    }

    try {
        const employeeExist = await Employee.findOne({ email: email })   //database: user entered

        if (employeeExist) {
            return res.render('creg', { message: "*Email already exists" })
        }

        const user = new Employee({ fname: fname, lname: lname, email: email, password: password, gender: gender, age: age, experience: experience });

        const employeeRegister = await user.save()

        var mailOptions = {
            from: 'abhishekshirke502@gmail.com',
            to: `${email}`,
            subject: 'Age Care',
            text: "Greetings from AgeCare, Thank you for applying at AgeCare, we will reach out to you shortly."
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }

        })

        if (employeeRegister) {
            res.status(201).render('cthank')
        }

        else {
            res.status(500).render('creg', { error: "Failed to register" })

        }

    } catch (error) {
        console.log(error);
    }
})


//admin
app.get('/admin', function (req, res, next) {
    var emp = Employee.find({});
    emp.exec(function (err, data) {
        if (err) res.send(err);
        // console.log(data);
        return res.render('admin', { records: data });
    })
})

app.post('/admin', async (req, res) => {
    try {
        const empEmail = req.body.empEmail;
        const msg = req.body.msg;
        // console.log(empEmail);
        // console.log(msg);

        // const careTakerDB = await Caretaker.findOne({email: empEmail});
        const careTakerDB = await Caretaker.findOne({ email: empEmail })
        const ctInEmp = await Employee.findOne({ email: empEmail })



        if (careTakerDB) {
            // return res.render('admin', {emp: "*Employee exists"});
            return res.send("Exists")

        }

        const e = new Caretaker({ email: empEmail, fname: ctInEmp.fname, lname: ctInEmp.lname, age: ctInEmp.age, experience: ctInEmp.experience });
        // console.log(email.age);

        const ct = await e.save();
        const m = "http://localhost:8000/caretakerReg";

        var mailOptions = {
            from: 'abhishekshirke502@gmail.com',
            to: `${empEmail}`,
            subject: 'Age Care',
            text: `Congratulation, your application has been approved. Welcome to AgeCare.
${msg}
Please fill this form ${m}`
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }

        })

        res.send("done")
    } catch (error) {
        // res.send(error);
        console.log(error);
        res.render('admin')
    }
});


//user subscription
var sub = "sub1";
app.post("/subs", authen, async (req, res) => {

    // if(sub1)
    const c = req.cookies.sub;
    if (c == "sub1" || c == "sub2" || c == "sub3" || c == "sub4") {
        return res.render('home', {name: req.cookies.name, error1: "Subscription already taken" })
    }
    res.cookie("sub", sub);
    const cookieEmail = req.cookies.email;
    const e = new Subscription({ email: cookieEmail, subscription: sub });
    const ct = await e.save();

    return res.redirect('https://rzp.io/l/YTDpmDga')
})

app.post("/subs2", authen, async (req, res) => {
    sub = "sub2";

    // if(sub1)
    const c = req.cookies.sub;
    if (c == "sub1" || c == "sub2" || c == "sub3" || c == "sub4") {
        return res.render('home', {name: req.cookies.name, error2: "Subscription already taken" })
    }
    res.cookie("sub", sub);
    const cookieEmail = req.cookies.email;
    const e = new Subscription({ email: cookieEmail, subscription: sub });
    const ct = await e.save();

    return res.redirect('https://rzp.io/l/1JKRSSHc')
})


app.post("/subs3", authen, async (req, res) => {
    sub = "sub3";

    // if(sub1)
    const c = req.cookies.sub;
    if (c == "sub1" || c == "sub2" || c == "sub3" || c == "sub4") {
        return res.render('home', {name: req.cookies.name, error3: "Subscription already taken" })
    }

    res.cookie("sub", sub);
    const cookieEmail = req.cookies.email;
    const e = new Subscription({ email: cookieEmail, subscription: sub });
    const ct = await e.save();
    return res.redirect('https://rzp.io/l/AXCLflaz6c')
})

app.post("/subs4", authen, async (req, res) => {
    sub = "sub4";

    // if(sub1)
    const c = req.cookies.sub;
    if (c == "sub1" || c == "sub2" || c == "sub3" || c == "sub4") {
        return res.render('home', {name: req.cookies.name, error4: "Subscription already taken" })
    }
    res.cookie("sub", sub);
    const cookieEmail = req.cookies.email;
    const e = new Subscription({ email: cookieEmail, subscription: sub });
    const ct = await e.save();

    return res.redirect('https://rzp.io/l/zZ70MinVF')
})
// app.post('/subs',  async (req, res)=>{
//     try {
//         const subsType = "sub1";
//         const sub1 = req.body.sub1;
//         // console.log(sub1);
//         // console.log(req.cookies);
//         var c = req.cookies;
//         // console.log(c.email);

//         const user = new Subscription({email: c.email, subscription: subsType});
//         const userRegister = await user.save()

//         // console.log("2");
//         if(userRegister){
//             res.redirect('/trial');
//         }

//         else{
//             res.send("fail")
//         }

//     } catch (error) {
//         console.log(error);
//         res.send(error)
//     }
// })

//sub1
app.get('/trial', (req, res) => {
    // const pays = req.body.sub1;

    res.render('trial', {name: req.cookies.name});
})

app.post('/trial', async (req, res) => {

    try {
        const date = req.body.setTodaysDate;
        var hospital = req.body.hospital;
        // const hospital2 = req.body.Leelavati;
        const h = req.body.hosp

        var c = req.cookies;

        const checkup = await Healthcheckup.findOne({ email: c.email })   //database: user entered

        if (checkup) {
            return res.render('trial', { time: "*You have aready registered" });
        }

        var name = "";
        if (hospital == "Jupiter") {
            // console.log("hi");
            name = "Jupiter";
            var user = new Healthcheckup({ email: c.email, date: date, hospital: "Jupiter" })
        }

        else if (hospital == "Leelavati") {
            name = "Leelavati"
            user = new Healthcheckup({ email: c.email, date: date, hospital: "Leelavati" })
        }
        const userRegister = await user.save();

        if (userRegister) {
            res.render('trial', { success: "Details has been sent on your email" });
        }

        var mailOptions = {
            from: 'abhishekshirke502@gmail.com',
            to: `${c.email}`,
            subject: 'Age Care',
            text: `Greetings from AgeCare,
            Your health checkup is held at ${name} on ${date} between 9:00 am to 5:00 pm`
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }

        })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
});

//sub2
app.get('/trial2', (req, res)=>{
    res.render('trial2', {name: req.cookies.name, email: req.cookies.email})
})

app.post('/trial2', async(req, res)=>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const number = req.body.number;

    const y = await Yoga.findOne({email: email});

    if(y){
        return res.render('trial2', {name: req.cookies.name, err: "*Already registered for the event"});
    }

    const yoga = new Yoga({fname: fname, lname: lname, email: email, phone: number});

    const ys = await yoga.save();

    var mailOptions = {
        from: 'abhishekshirke502@gmail.com',
        to: `${email}`,
        subject: 'Age Care',
        text: `Greetings from AgeCare,
        You have succesfully bregistered for the yoga event held at Santacruz on 3rd November, 2022
        Address:Shri Yogendra Marg, Prabhat Colony, Santacruz East, Mumbai - 400055 India `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }

    })

    return res.render('trial2', {name: req.cookies.name, success: "You have successfully registered for the event",  email: req.cookies.email})

})

//trial3

app.get('/trial3', (req, res)=>{
    res.render('trial3', {name: req.cookies.name, email: req.cookies.email});
})

//trial4
app.get('/trial4', (req, res)=>{
    res.render('trial4', {name: req.cookies.name, email: req.cookies.email});
})



app.get('/caretakers', authen, function (req, res, next) {
    var emp = Caretaker.find({});
    // var empt = Ctinfo.find({});
    emp.exec(function (err, data) {
        if (err) res.send(err);

        return res.render('caretakers', {name: req.cookies.name, records: data });
    })



})


app.post('/caretakers', (req, res) => {
    var emp = Caretaker.find({});
    emp.exec(function (err, data) {
        if (err) res.send(err);

        const one = req.body.one;
        const two = req.body.two;

        // console.log(one);
        // console.log(two);
        let temp = [];
        for (const ctnData of data) {
            if (one == "Charge less than Rs60") {
                if ((ctnData.charge >= 20 && ctnData.charge <= 60)) {
                    temp.push(ctnData);
                }

            }

            else if (two == "Charge greater than Rs60") {
                if ((ctnData.charge >= 61)) {
                    temp.push(ctnData);
                }
            }
        }

        return res.render('caretakers', {name: req.cookies.name, records: temp });
    })
})

//caretaker registration
imgName = "";
storage = multer.diskStorage({
    destination: function (req, file, c) {
        c(null, '../uploads')
    },
    filename: function (req, file, c) {
        c(null, file.originalname)
        imgName = file.originalname;
        // console.log(imgName);
    }
})
upload = multer({ storage: storage })

app.get('/caretakerReg', (req, res) => {
    // Caretaker.find({}, (err, items)=>{
    //     if(err)
    //         return res.send(err);

    //     else{
    //         res.render('caretakerReg', {items: items})
    //     }
    // })
    res.render("caretakerReg")

})

app.post('/caretakerReg', upload.single('profile-file'), async (req, res) => {

    const slots = req.body.slot;
    const slotst = req.body.slott;
    const slotsth = req.body.slotth;
    const slotsf = req.body.slotf;
    const pass = req.body.pass;
    const cpass = req.body.cpass;

    var arr = [slots, slotst, slotsth, slotsf];

    if(pass != cpass){
        return res.render('caretakerReg', { message: "*Password and Confirm password should be same"});
    }

    const charge = req.body.charge;
    if (charge <= 0 || charge > 300) {
        return res.render('caretakerReg', { message: "*Amount cannot be less than 0 or greater than 300" });
    }
    const email = req.body.email;
    const userExist = await Ctinfo.findOne({ email: email })   //database: user entered


    if (userExist) {
        return res.render('caretakerReg', { message2: "*Email already exists" })
    }

    const user = new Caretaker({ email: email, slot: arr, charge: charge });
    // const ctPass = new Caretaker({email: email, })
    // Caretaker.findOneAndUpdate({ email: email }, {password: pass}, (err, result) => {
    //         if (err) {
    //             res.send(err);
    //         }
    //     });

    const searchCt = await Caretaker.findOne({ email: email });
    console.log(searchCt);
    console.log(email);

    if (searchCt) {
        Caretaker.findOneAndUpdate({ email: email }, { charge: charge, slot: arr, password: pass }, (err, result) => {
            if (err) {
                res.send(err)
            }
        })
    }

    else {
        console.log("Caretaker not found");
    }


    // const userRegister = await user.save()


    var responses = '<a href="/">Home</a><br>'
    responses += "Files uploaded successfully.<br>"
    responses += `<img style="width: 500px;" src="${imgName}" /> <br>`
    return res.render('caretakerReg', { message1: "Thank you!" })


})


//employees login
app.get('/ctLogin', (req, res) => {
    res.render('ctLogin');
})

app.post('/ctLogin', async (req, res) => {
    const cemail = req.body.cemail;
    const cpassword = req.body.cpassword;

    
    const careTakerDB = await Caretaker.findOne({ email: cemail });
    console.log(careTakerDB);
    
    // if(careTakerDB.password != cpassword)
    // return res.render('ctLogin', { err: "*Invalid Credentials" });
    
    if (careTakerDB) {
        return res.redirect('/ctDashboard')
    }


})

//prime
app.get('/prime', authen,(req, res) => {
    const c = req.cookies.sub;
    if (c == "sub1") {
        return res.render('trial', {name: req.cookies.name});
    }

    else if(c == "sub2"){
        return res.render('trial2', {name: req.cookies.name, email: req.cookies.email});
    }

    else if(c == "sub3"){
        return res.render('trial3', {name: req.cookies.name, email: req.cookies.email});
    }

    return res.render("noSubs")
})



//caretaker book
app.get('/caretakerBook', (req, res) => {



    res.render('caretakerBook');
})

app.post("/caretakerBook", async (req, res) => {
    const email = req.body.n;



    const ctBook = await Caretaker.find({ email: email });

    // console.log(ctBook);

    // let temp = [];
    var emp = Caretaker.find({ email: email });
    emp.exec(function (err, data) {
        if (err) res.send(err)


        res.render('caretakerBook', {name: req.cookies.name, records: data })

    })



})

app.post('/finalBook', async (req, res) => {
    const cone = req.body.cone;
    const ctwo = req.body.ctwo;
    const cthree = req.body.cthree;
    const cfour = req.body.cfour
    const email = req.body.email;


    var emp = Caretaker.find({ email: email });


    const ct = await Caretaker.find({ email: email });

    //  console.log(ct);
    let ot = true;

 

    let c = [];
    c[0] = cone;
    c[1] = ctwo;
    c[2] = cthree;
    c[3] = cfour;

    let temp = ct[0].slot;
    let a = 0, b = 0, d=0;

    // console.log(c[0] == temp[0]);


    if (c[0] == temp[0]) {
        temp[0] = "busy";
        // Caretaker.findOneAndUpdate({ email: email }, { slot: temp }, (err, result) => {
        //     if (err) {
        //         res.send(err);
        //     }
        // })
        b = 1;
        d=1;
        // console.log(1);
    }

    else {
        if (c[0] == "9-12am" && temp[0] == "busy" || (ct[0].slot[1]==null)) {
            a = 1;
            return res.send("Caretaker is busy");
        }

        // else{
        //     a=1;
        //     return res.send("No") 
        // }
    }

    if (c[1] == temp[1]) {
        temp[1] = "busy";
        // Caretaker.findOneAndUpdate({ email: email }, { slot: temp }, (err, result) => {
        //     if (err) {
        //         res.send(err);
        //     }
        // })

        b = 1;
        d=1;

        // console.log(2);
    }

    else {
        if (c[1] == "12-3pm" && temp[1] == "busy" || (ct[0].slot[1]==null)) {
            a = 1;
            return res.send("Caretaker is busy");
        }

        // else{
        //     a=1;
        //     return res.send("No") 
        // }
    }

    if (c[2] == temp[2]) {
        temp[2] = "busy";
        // Caretaker.findOneAndUpdate({ email: email }, { slot: temp }, (err, result) => {
        //     if (err) {
        //         res.send(err);
        //     }
        // })

        b = 1;
        d=1;

        // console.log(3);
    }



    else {
        if (c[2] == "3-6pm" && temp[2] == "busy" || (ct[0].slot[1]==null)) {
            a = 1;
            return res.send("Caretaker is busy");
        }

        // else{
        //     a=1;
        //     return res.send("No") 
        // }
    }

    if (c[3] == temp[3]) {
        temp[3] = "busy";
        // Caretaker.findOneAndUpdate({ email: email }, { slot: temp }, (err, result) => {
        //     if (err) {
        //         res.send(err);
        //     }
        // })

        b = 1;
        d=1;

        // console.log(4);
    }

    else {
        // console.log(c[3], temp[3]);
        if (c[3] == "6-9pm" && temp[3] == "busy" || (ct[0].slot[1]==null)) {
            a = 1;
            return res.send("Caretaker is busy");
        }

        // else{
        //     a=1;
        //     return res.send("No")
        // }
    }

    // ct[0].slot = temp;
    // console.log(temp[3]);

    if(d==0){
        return res.send("Please select slot")
    }

    if(b==1){
        Caretaker.findOneAndUpdate({ email: email }, { slot: temp }, (err, result) => {
            if (err) {
                res.send(err);
            }
        })
    }


    let userSlot = [];
    let indx=0;

    if(temp[0]=="busy"){
        userSlot[indx] = "9-12am";
        indx++;
    }

    if(temp[1]=="busy"){
        userSlot[indx] = "12-3pm";
        indx++;
    }

    if(temp[2]=="busy"){
        userSlot[indx] = "3-6pm";
        indx++;
    }

    if(temp[3]=="busy"){
        userSlot[indx] = "6-9pm";
        indx++;
    }



    Registered.findOneAndUpdate({email: req.cookies.email}, {slot: userSlot, ctName: email}, (err, result)=>{
        if(err){
            res.send(err);
        }
    })


    //user mail
    var mailOptions = {
        from: 'abhishekshirke502@gmail.com',
        to: `${req.cookies.email}`,
        subject: 'Age Care',
        text: `Greetings from AgeCare,
        You have succesfully booked a caretaker, ${email} in the time slot ${userSlot}.
        Caretaker will visit 10-15 minutes prior to the scheduled time. `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }

    })




    if (a == 0) {
        res.redirect('https://rzp.io/l/YTDpmDga')
    }


});


app.get('/userProfile',authen,  async(req, res)=>{
    const email = req.cookies.email;
    const ifExist = await Userprofile.findOne({email: email});
    // console.log(ifExist);

    const hist = await Registered.findOne({email: email});
    let slotArray = [];
    slotArray = hist.slot;
    console.log(slotArray[0]);
    if(ifExist){
        return res.render('userProfile', {name: req.cookies.name, img: req.cookies.name, fname: ifExist.fname, email: ifExist.email, mobile: ifExist.number, address: ifExist.address,time: "Time slot: ", slotArray: slotArray, ctName: "Caretaker email: ", ctEmail: hist.ctName});

    }

    res.render('userProfile', {name: req.cookies.name, img: req.cookies.name});
})

app.get('/editProfile', (req, res)=>{
    res.render('editProfile');
})

app.post('/editProfile', upload.single('profile-file'), async(req, res)=>{

    try {
        const fname = req.body.fname;
        const mobile = req.body.mobile;
        const email = req.body.email;
        const address = req.body.address;
        // const pincode = req.body.pincode;

        const userExist = await Userprofile.findOne({ email: email })   //database: user entered

        if (userExist) {
            return res.render('editProfile',{ msg2: "*Profile exists." })
            // return res.render('profile2', { message: `${fname}.jpg`, name: `${fname}`, email: `${email}`, address: `${address}` });
        }

        const user = new Userprofile({ fname: fname, email: email, number: mobile, address: address});

        const userRegister = await user.save()

        // var response = '<a href="/">Home</a><br>'
        // response += "Files uploaded successfully.<br>"
        // let path = '/graphs2.jpg'
        // response += `<img style="width: 500px;" src="${imgName}" /> <br>`
        // return res.send(response)
        return res.redirect('/');
    }
    catch (err) {
        res.send(err);
    }
    // res.render('editProfile', {name: req.cookies.name});
})

//ctDasdboard
app.get('/ctDashboard', (req, res)=>{
    res.render('ctDashboard');
})


//feedback
app.post('/feedback', authen, async(req, res)=>{
    const names = req.body.names;
    const email = req.body.email;
    const subject= req.body.subject;
    const message = req.body.message;

    console.log(names);

    const msg = new Feedback({ names: names, email: email, subject: subject, message: message })

    const s = await msg.save();

    res.render('feedback', {name: req.cookies.name, repl: "Thank you for your valuable feedback!", email: req.cookies.email });
})


app.get('/yogaForm', (req, res)=>{
    res.render('yogaForm');
})

app.listen(PORT, () => {
    console.log('Connection is running');
})