const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const { studentUser } = require('../../Models/modelIndex');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

router.get('/student/:code', async (req, res) => {
    if (req.obj.role === 'teacher') {
        const students = await studentUser
            .find(
                {
                    course_enrolled: {
                        $elemMatch: { course_id: req.params.code },
                    },
                },
                { _id: 1, name: 1, email: 1 }
            )
            .exec();
        console.log(students);
        res.json(students);
    }
});

module.exports = router;
