const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

const hasToken = (req, res, next) => {
    try {
        const auth = req.headers['authorization'];
        const authToken = auth.split(' ')[1];
        const result = jwt.verify(authToken, process.env.key);
        if (
            result.role === 'admin' ||
            result.role === 'student' ||
            result.role === 'teacher'
        ) {
            req.obj = result;
            next();
        } else {
            res.json({ ok: false, msg: 'hasToken - Unidentified token' });
        }
    } catch (err) {
        console.log(err);
    }
};
module.exports = hasToken;
