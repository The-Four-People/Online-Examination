const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const { courseIndex } = require('../../Models/modelIndex');
const { courseSchema } = require('../../Schema/schemaIndex');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const findCourseProperty = (property, value) => {
    const promise = new Promise((resolve, reject) => {
        try {
            courseIndex.find({ [property]: value }, (err, course) => {
                if (!err) {
                    resolve(course);
                } else {
                    reject(err);
                }
            });
        } catch (err) {
            reject({ ok: false, msg: 'find error', error: err });
        }
    });
    return promise;
};

const postStudent = (course_code) => {};

router.post('/', (req, res) => {
    let text = '';
    if (req.obj.role === 'student') {
        text = 'student';
    } else if (req.obj.role === 'teacher') {
        text = 'teacher';
    } else if (req.obj.role === 'admin') {
        text = 'admin';
    } else {
        text = 'cannot verify';
    }
});

router.get('/', (req, res) => {
    if (req.obj.role === 'teacher') {
        findCourseProperty('teacher_id', req.obj._id)
            .then((courses) => {
                if (courses) {
                    console.log('Getting all courses');
                    res.json(courses);
                } else {
                    res.json({ ok: false, msg: 'not found' });
                }
            })
            .catch((err) => res.json(err));
    }
});

router.get('/:code', async (req, res) => {
    if (req.obj.role === 'student') {
    } else if (req.obj.role === 'teacher') {
        var course_auth = false;
        await findCourseProperty('course_code', req.params.code)
            .then(async ([course]) => {
                if (course) {
                    course_auth =
                        req.obj._id.toString() === course.teacher_id.toString();
                    console.log(course_auth);
                } else {
                    res.json({ ok: false, msg: 'not found' });
                }
            })
            .catch((err) => res.json(err));

        if (course_auth) {
            const collection = mongoose.model(req.params.code, courseSchema);
            collection.find({}, (err, course) => {
                if (!err) {
                    console.log(course);
                    res.json(course);
                } else {
                    res.json(err);
                }
            });
        }
    }
});

module.exports = router;
