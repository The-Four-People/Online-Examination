const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const { studentUser, teacherUser } = require('../../Models/modelIndex');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const toObjId = (id) => {
    const ObjectId = mongoose.Types.ObjectId;
    return ObjectId(id);
};

router.post('/teacher/', async (req, res) => {
    if (req.obj.role === 'student') {
        console.log(toObjId(req.body.id));
        const teacher = await teacherUser
            .findOne({ id: toObjId(req.body.id) }, { id: 1, name: 1, email: 1 })
            .lean()
            .exec();
        console.log(teacher);
        res.json(teacher);
    }
});

module.exports = router;
