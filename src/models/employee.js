const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const employeeSchema = new mongoose.Schema({
    fname:{
        type: String,
    },

    lname:{
        type: String,
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    gender:{
        // required: true,
    },

    age: {
        type: Number
    },

    experience: {
        type: Number
    },


})


const Employee = new mongoose.model("Employee", employeeSchema)

module.exports = Employee;