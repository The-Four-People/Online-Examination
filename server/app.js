const express = require('express')
const dotenv = require('dotenv')
const Register = require('./Routes/Register')
const cors = require('cors')
dotenv.config()
const app = express()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.use('/register',Register)


app.get('/',(req,res) => {
    res.status(404).send("404 not found")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log('App listening on port ' + PORT))