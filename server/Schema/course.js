const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')


dotenv.config({
    path: path.join(__dirname, "../", ".env")
})


const quiz = {
    id: {
        type: Number,
        // required: true,
    },
    marks: {
        type: Number,
        // required: true
    },
    question: {
        type: String,
        // required: true
    },
    options: {
        type:[String],
    },
    answer: {
        type: String,
        // required: true
    }

}

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isStarted: {
        type: Boolean,
        required: true,
        default:false
    },
    total_marks: {
        type: Number,
        // required: true,
        default:null
    },
    courseId:{
        type:String,
        required:true
    },
    quiz: [quiz],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    }
})

module.exports = courseSchema