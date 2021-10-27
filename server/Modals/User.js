const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path:path.join(__dirname,'../','.env')
})

// console.log(process.env.CONNECTION_URI)
mongoose.connect(`${process.env.CONNECTION_URI}developers${process.env.CONNECTION_SUFFIX}`,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => {
        console.log('Successfully connected to the database')
    })
    .catch((err) => {
        console.log('Error ' + err)
    })
const User = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('admins',User)

