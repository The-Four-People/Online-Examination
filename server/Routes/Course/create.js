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

const updateCourseIndex = async (name, code, id) => {
    console.log(name, code, id);
    var done = false;
    await courseIndex
        .create({
            course_code: code,
            course_name: name,
            teacher_id: id,
        })
        .then((data, err) => {
            if (!err) {
                console.log('Course Index updated');
                done = true;
            } else {
                console.log(err);
            }
        })
        .catch((err) => console.log(err));
    return done;
};

router.post('/:id', async (req, res) => {
    try {
        const authToken = req.headers['authorization'];
        const token = authToken.split(' ')[1];
        const verify = jwt.verify(token, process.env.key);
        const teacher = await findTeachersEmail(verify.email);
        console.log(req.params.id);
        var courseFromIndex = await courseIndex
            .findOne({ course_code: req.params.id })
            .exec();
        console.log(courseFromIndex);

        if (courseFromIndex) {
            const collectionCreated = await createCollection(
                courseFromIndex.course_name,
                req.params.id,
                req.body.testName,
                req.body.testType,
                req.body.marks,
                teacher._id.toString(),
                req.body.test_date,
                req.body.test_start_time,
                req.body.test_duration
            );
            if (collectionCreated)
                res.json({ ok: true, msg: `${req.body.testName} created` });
        } else {
            res.json({ ok: false, msg: 'Course Not created' });
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/:id/:test', async (req, res) => {
    try {
        var newQues = {
            id: req.body.id,
            question: req.body.question,
            marks: req.body.marks,
            answer: req.body.answer,
            options: req.body.options,
        };

        const collection = mongoose.model(req.params.id, courseSchema);
        const test = await collection
            .findOne({ test_name: req.params.test })
            .exec();
        const questionInserted = await insertNewQuestion(test, newQues);
        console.log(questionInserted);
        res.json({ ok: questionInserted });
    } catch (err) {
        console.log(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const authtoken = req.headers['authorization'];
        const token = authtoken.split(' ')[1];
        const verify = jwt.verify(token, process.env.key);
        const teacher = await findTeachersEmail(verify.email);
        console.log(teacher);
        const smallID = randomString.generate(7);
        // const collectionCreated = await createCollection(
        //     req.body.courseName,
        //     smallID,
        //     teacher._id.toString()
        // );
        const indexUpdated = await updateCourseIndex(
            req.body.courseName,
            smallID,
            teacher._id.toString()
        );
        const teacherUpdated = await updateTeacherCourses(
            req.body.courseName,
            teacher,
            smallID
        );
        if (indexUpdated && teacherUpdated) {
            res.json({
                ok: true,
                msg: 'Course successfully created and added to teachers document',
                course_id: smallID,
            });
        } else {
            res.json({
                ok: false,
                msg: 'Course creation unsuccessfull',
            });
        }
    } catch (err) {
        console.log(err);
        res.json({ ok: false, msg: 'An error occured', error: err });
    }
});

const createCollection = (
    courseName,
    courseID,
    testName,
    testType,
    marks,
    createdBy,
    test_date,
    test_start_time,
    test_duration
) => {
    const promise = new Promise((res, rej) => {
        try {
            const collection = mongoose.model(courseID, courseSchema);
            collection
                .create({
                    name: courseName,
                    createdBy: createdBy,
                    courseId: courseID,
                    test_name: testName,
                    test_type: testType,
                    total_marks: marks,
                    startDate: test_date,
                    time: test_start_time,
                    duration: test_duration,
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

const insertNewQuestion = (test, question) => {
    const promise = new Promise((res, rej) => {
        try {
            test.quiz.push(question);
            test.save()
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

const updateTeacherCourses = (courseName, teacher, smallID) => {
    const promise = new Promise((res, rej) => {
        try {
            // ["jklnkl","sj"]
            const arr = {
                name: courseName,
                code: smallID,
            };
            teacher.courses.push(arr);
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
