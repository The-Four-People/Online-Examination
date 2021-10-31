const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path:path.join(__dirname,'../','.env')
})

const teacherCoursesSchema = {
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    students_enrolled:{
        type:[String],
        unique:true
    }
}

const teacherSchema = new mongoose.Schema({
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
    courses:[teacherCoursesSchema],
    role:{
        type:String,
        required:true,
        default:'teacher'
    }
})

module.exports = mongoose.model('teachers',teacherSchema)