const isAdmin = require('./admin');
const isAdminOrTeacher = require('./adminOrTeacher');
const hasToken = require('./hasToken');
module.exports = {
    isAdmin,
    isAdminOrTeacher,
    hasToken,
};
