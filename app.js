const express = require('express')
const dotenv = require('dotenv')
const Register = require('./Routes/Register')
const cors = require('cors')
const  { lookup } = require('geoip-lite')
dotenv.config()
const app = express()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(logger)


app.use('/register',Register)


app.get('/',(req,res) => {
    res.status(404).send("404 not found")
})


function logger(req,res,next){
    const log = {
        ip:req.connection.remoteAddress, // req.ip 
        url:req.url,
        method:req.method,
        location:lookup(req.connection.remoteAddress)
    }
    console.log()
    console.log(log)
    console.log()
    next()
}

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log('App listening on port ' + PORT))