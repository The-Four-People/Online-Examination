const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const { teacherUser, courseIndex } = require('../../Models/modelIndex');
const { courseSchema } = require('../../Schema/schemaIndex');

// backend.com/api/course/update/:code/:test

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

router.post('/:code/:test', async (req, res) => {
    if (req.obj.role === 'teacher') {
        const doesCourseExist = await courseIndex
            .findOne({ course_code: req.params.code })
            .exec();
        if (doesCourseExist) {
            const teacher = await teacherUser
                .findOne({ email: req.obj.email })
                .exec();
            if (
                teacher['_id'].toString() ===
                doesCourseExist.teacher_id.toString()
            ) {
                const testModel = mongoose.model(req.params.code, courseSchema);
                const test = await testModel.findOne({
                    test_name: req.params.test,
                });
                if (test) {
                    if (req.body.id) {
                        const a = await testModel.updateOne(
                            { test_name: req.params.test },
                            {
                                $pull: {
                                    quiz: { id: req.body.id },
                                },
                            }
                        );
                        console.log(a);
                        if (a && a.modifiedCount > 0) {
                            res.json({
                                ok: true,
                                msg: `question with id ${req.body.id} removed`,
                            });
                        } else {
                            res.json({
                                ok: true,
                                msg: `question with id ${req.body.id} already removed or doesn't exist`,
                            });
                        }
                    } else if (req.body.startDate) {
                        if (
                            new Date(req.body.startDate).getTime() >=
                            new Date(new Date().toDateString()).getTime()
                        ) {
                            const a = await testModel
                                .updateOne(
                                    { test_name: req.params.test },
                                    { $set: { startDate: req.body.startDate } }
                                )
                                .exec();
                            if (a && a.modifiedCount > 0) {
                                res.json({
                                    ok: true,
                                    msg: `startDate is now ${req.body.startDate} `,
                                });
                            } else {
                                res.json({
                                    ok: false,
                                    msg: `unable to update startDate`,
                                });
                            }
                        } else {
                            res.json({
                                ok: false,
                                msg: 'date should be greater than today',
                            });
                        }
                    } else if (req.body.time) {
                        const a = await testModel
                            .updateOne(
                                { test_name: req.params.test },
                                { $set: { time: req.body.time } }
                            )
                            .exec();
                        if (a && a.modifiedCount > 0) {
                            res.json({
                                ok: true,
                                msg: `time is now ${req.body.time}`,
                            });
                        } else {
                            res.json({
                                ok: false,
                                msg: `unable to update time`,
                            });
                        }
                    } else if (req.body.duration) {
                        const a = await testModel
                            .updateOne(
                                { test_name: req.params.test },
                                {
                                    $set: {
                                        duration: parseFloat(req.body.duration),
                                    },
                                }
                            )
                            .exec();
                        if (a && a.modifiedCount > 0) {
                            res.json({
                                ok: true,
                                msg: `duration is now ${req.body.duration}`,
                            });
                        } else {
                            res.json({
                                ok: false,
                                msg: `unable to update duration`,
                            });
                        }
                    } else {
                        res.json({ ok: false, msg: 'missing body' });
                    }
                } else {
                    res.json({ ok: false, msg: 'test does not exist' });
                }
            } else {
                res.json({
                    ok: false,
                    msg: 'Teacher did not create this course',
                });
            }
        } else {
            res.json({ ok: false, msg: 'Course does not exist' });
        }
    } else {
        res.json({
            ok: false,
            msg: 'User does not have permission to modify this course',
        });
    }
});

module.exports = router;
