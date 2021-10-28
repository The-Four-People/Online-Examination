const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')


dotenv.config({
    path: path.join(__dirname, "../", ".env")
})


const quiz = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type:[String],
        required:true
    },
    answer: {
        type: String,
        required: true
    }

})

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isStarted: {
        type: Boolean,
        required: true
    },
    total_marks: {
        type: Number,
        required: true
    },
    quiz: [quiz],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('courses',courseSchema)