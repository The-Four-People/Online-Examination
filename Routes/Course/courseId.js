const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const path = require('path');
const randomstring = require('randomstring');
const { courseIndex } = require('../../Models/modelIndex');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const findCourse = (course_code) => {
    const promise = new Promise((resolve, reject) => {
        try {
            courseIndex.findOne({ course_code: course_code }, (err, course) => {
                if (!err) resolve(course);
                else reject(err);
            });
        } catch (err) {
            reject({ ok: false, msg: 'error', error: err });
        }
    });
    return promise;
};

const save = (course_code, course_name, teacher_email) => {
    console.log(course_code, course_name, teacher_email);
    const promise = new Promise((resolve, reject) => {
        try {
            courseIndex
                .create({
                    course_code,
                    course_name,
                    teacher_email,
                })
                .then((data, err) => {
                    if (!err) {
                        console.log(data);
                        resolve({
                            ok: true,
                            msg: `Course Created ${data.course_code} ${data.course_name}`,
                        });
                    } else {
                        reject({
                            ok: false,
                            msg: 'Operation Unsucessfull',
                            error: err,
                        });
                    }
                })
                .catch((err) => {
                    reject({ ok: false, msg: 'Error', error: err });
                });
        } catch (err) {
            reject({ ok: false, msg: 'Error', error: err });
        }
    });

    return promise;
};

const postStudent = (course_code) => {
    findCourse(course_code)
        .then((course, err) => {
            //
        })
        .catch((err) => res.json(err));
};

router.post('/', (req, res) => {
    let text = '';
    // console.log(req.obj);
    if (req.obj.role === 'student') {
        text = 'student';
    } else if (req.obj.role === 'teacher') {
        const { course_name } = req.body;
        console.log('before save');
        save(randomstring.generate(7), course_name, req.obj.email)
            .then((data, err) => {
                console.log('hi');
                err ? res.json(err) : res.json(data);
            })
            .catch((err) => {
                console.log('hello');
                res.json(err);
            });
        text = 'teacher';
    } else if (req.obj.role === 'admin') {
        text = 'admin';
    } else {
        text = 'cannot verify';
    }
});

module.exports = router;
