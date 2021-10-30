const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    course_enrolled: {
        type: [
            {
                course_id: { type: String, unique: true },
                course_name: String,
                teacher_email: String,
            },
        ],
        default: [],
    },
    role: {
        type: String,
        required: true,
        default: 'student',
    },
});

module.exports = mongoose.model('student', studentSchema);
