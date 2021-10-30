const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '../', '.env'),
});

// mongoose.connection.close()
mongoose
    .connect(`${process.env.CONNECTION_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Successfully connected to the database');
    })
    .catch((err) => {
        console.log('Error ' + err);
    });
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'admin',
    },
});

module.exports = mongoose.model('admins', adminSchema);
