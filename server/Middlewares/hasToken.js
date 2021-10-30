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
        console.log(authToken);
        if (
            result.role === 'teacher' ||
            result.role === 'admin' ||
            result.role === 'student'
        ) {
            req.obj = result;
            next();
        } else {
            res.json({ ok: false, msg: 'Not Authorised' });
        }
    } catch (err) {
        res.json({ ok: false, msg: 'Error Occured' });
    }
};
module.exports = hasToken;
