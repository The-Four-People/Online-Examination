const express = require('express')
const { teacherUser } = require('../../Models/modelIndex')
const dotenv = require('dotenv')
const path = require('path')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const router = express.Router()

dotenv.config({
    path: path.join(__dirname, '../../', '.env')
})

router.post('/', async (req, res, next) => {
    try {
        const authtoken = req.headers['authorization']
        const token = authtoken.split(" ")[1]
        const verify = jwt.verify(token, process.env.key)
        const teacher = await findTeachersEmail(verify.email)
        console.log(teacher)
        const updated = await updateTeacherCourses(teacher, req.body.courseName)
        res.json({ok:updated})
    }
    catch (err) {
        console.log(err)
        res.json({ ok: false, msg: "An error occured", error: err })
    }
})

const updateTeacherCourses = (teacher, courseName) => {
    const promise = new Promise((res, rej) => {
        try {
            teacher.courses.push(nanoid())
            teacher.save()
                .then(data => {
                    console.log(data)
                    res(true)
                })
                .catch(err => {
                    console.log(err)
                    rej(false)
                })
        } catch (err) {
            console.log(err)
            rej(false)
        }
    })

    return promise
}

const findTeachersEmail = (email) => {
    const promise = new Promise((res, rej) => {
        try {
            teacherUser.findOne({ email: email }, function (err, teacher) {
                if (!err) {
                    res(teacher)
                } else {
                    console.log('findTeachersId error : ' + err)
                    rej(null)
                }
            })
        } catch (err) {
            rej(null)
        }
    })


    return promise
}

module.exports = router