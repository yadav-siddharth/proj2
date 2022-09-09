const express = require('express')
const path = require('path')
const ejs = require('ejs')
// require('../templates/partials/header')
const cookieParser = require('cookie-parser')
const port = process.env.PORT ||8000;

const app = express();

const staticpath = path.join(__dirname, "../public")
app.use(express.static(staticpath))
const view_path = path.join(__dirname, "../templates/views")
// const partialspath = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))    


app.set('view engine', "ejs")
app.set("views", view_path)
// ejs.registerPartials(partialspath)


app.get('/', (req, res)=>{
    res.render('home')
})  

app.get('/head', (req, res)=>{
    res.render('header')
})

app.get('/sleep', (req, res)=>{
    res.render('sleep')
})


app.listen(port, ()=>{
    console.log('Connection is running');
})