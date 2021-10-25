const express = require('express')
const dotenv = require('dotenv')
const Register = require('./Routes/Register')
const Login = require('./Routes/Login')
const Verify = require('./Routes/Verify')
const cors = require('cors')
dotenv.config()
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger)


app.use('/api/register', Register)
app.use('/api/login',Login)
app.use('/api/verify',Verify)
app.get('/', (req, res) => {
    res.sendStatus(404)
})


function logger(req, res, next) {
    const log = {
        ip: req.connection.remoteAddress, // req.ip 
        url: req.url,
        method: req.method
    }
    console.log()
    console.log(log)
    console.log()
    next()
}

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log('App listening on port ' + PORT))