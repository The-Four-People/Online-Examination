const express = require('express');
const { teacherUser, courseIndex } = require('../../Models/modelIndex');
const { courseSchema } = require('../../Schema/schemaIndex');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const randomString = require('randomstring');
const router = express.Router();

dotenv.config({
    path: path.join(__dirname, '../../', '.env'),
});

const updateCourseIndex = (name, code, id) => {
    console.log(name, code, id);
    courseIndex
        .create({
            course_code: code,
            course_name: name,
            teacher_id: id,
        })
        .then((data, err) => {
            if (!err) {
                console.log('Course Index updated');
            } else {
                console.log(err);
            }
        })
        .catch((err) => console.log(err));
};

router.post('/', async (req, res, next) => {
    try {
        const authtoken = req.headers['authorization'];
        const token = authtoken.split(' ')[1];
        const verify = jwt.verify(token, process.env.key);
        const teacher = await findTeachersEmail(verify.email);
        console.log(teacher);
        const smallID = randomString.generate(7);
        const collectionCreated = await createCollection(
            req.body.courseName,
            smallID,
            teacher._id.toString()
        );
        const updated = await updateTeacherCourses(teacher, smallID);
        await updateCourseIndex(
            req.body.courseName,
            smallID,
            teacher._id.toString()
        );
        if (collectionCreated && updated) {
            res.json({
                ok: true,
                msg: 'Collection successfully created and added to teachers document',
            });
        } else {
            res.json({
                ok: collectionCreated,
                msg: 'Collection creation unsuccessfull',
            });
        }
    } catch (err) {
        console.log(err);
        res.json({ ok: false, msg: 'An error occured', error: err });
    }
});

const createCollection = (courseName, courseID, createdBy) => {
    const promise = new Promise((res, rej) => {
        try {
            const collection = mongoose.model(courseID, courseSchema);
            collection
                .create({
                    name: courseName,
                    createdBy: createdBy,
                    courseId: courseID,
                })
                .then((data, err) => {
                    if (!err) {
                        res(true);
                    } else {
                        console.log(err);
                        rej(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    rej(false);
                });
        } catch (err) {
            rej(false);
        }
    });

    return promise;
};

const updateTeacherCourses = (teacher, smallID) => {
    const promise = new Promise((res, rej) => {
        try {
            // ["jklnkl","sj"]
            teacher.courses.push(smallID);
            teacher
                .save()
                .then((data) => {
                    console.log(data);
                    res(true);
                })
                .catch((err) => {
                    console.log(err);
                    rej(false);
                });
        } catch (err) {
            console.log(err);

            rej(false);
        }
    });

    return promise;
};

const findTeachersEmail = (email) => {
    const promise = new Promise((res, rej) => {
        try {
            teacherUser.findOne({ email: email }, function (err, teacher) {
                if (!err) {
                    res(teacher);
                } else {
                    console.log('findTeachersId error : ' + err);
                    rej(null);
                }
            });
        } catch (err) {
            rej(null);
        }
    });

    return promise;
};

module.exports = router;
