// look up file for admin and other purposes
// consist of { course_code , course_name, teacher_email}
// extra field -> created on and enrolled student

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const courseIndexSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        // unique: true,
    },
    course_name: {
        type: String,
    },
    teacher_id: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    enrolled_student: {
        type: [String],
        default: [],
    },
    created_on: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('courseIndex', courseIndexSchema);
