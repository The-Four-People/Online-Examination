const adminUser = require('./admin')
const teacherUser = require('./teacher')
const studentUser =  require('./student')
const courseModel = require('./course')

module.exports = {
    adminUser,
    teacherUser,
    studentUser,
    courseModel
}