const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path:path.join(__dirname,'../','.env')
})

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'student'
    }
})

module.exports = mongoose.model('student',studentSchema)
