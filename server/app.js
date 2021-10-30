const express = require('express');
const dotenv = require('dotenv');
const {
    adminRegister,
    teacherRegister,
    studentRegister,
} = require('./Routes/Register/registerIndex');
const {
    adminLogin,
    studentLogin,
    teacherLogin,
} = require('./Routes/Login/loginIndex');
const { createCourse, courseId } = require('./Routes/Course/courseIndex');
const {
    isAdmin,
    isAdminOrTeacher,
    hasToken,
} = require('./Middlewares/middlewareIndex');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));
app.use(logger);

//Register Router
app.use('/api/register/admin', isAdmin, adminRegister);
app.use('/api/register/teacher', isAdmin, teacherRegister);
app.use('/api/register/student', isAdminOrTeacher, studentRegister);

//Login routes
app.use('/api/login/admin', adminLogin);
app.use('/api/login/teacher', teacherLogin);
app.use('/api/login/student', studentLogin);

//Courses Router
app.use('/api/course/new', createCourse);
app.use('/api/course/', hasToken, courseId);

app.get('/', (req, res) => {
    res.sendStatus(404);
});

function logger(req, res, next) {
    const log = {
        ip: req.connection.remoteAddress, // req.ip
        url: req.url,
        method: req.method,
    };
    console.log();
    console.log(log);
    console.log();
    next();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('App listening on port ' + PORT));
