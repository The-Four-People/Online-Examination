const express = require('express')
const UserModal = require('../Modals/User')
const bcrypt = require('bcrypt')
const Router = express.Router()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

function save(name,email,password){
    // const promise = new Promise(function(resolve,reject){
    //     pass
    // })
    // password = bcrypt
    UserModal.create({
        name,
        email,
        password
    }).then((data,err) => {
        if(!err){
            return true
        }else{
            return false
        }
    }).catch(err => {
        return false
    })
}

Router.post('/',(req,res) => {
    console.log(req.body)
    
    res.json({
        ok:true
    })

})

Router.get('/',(req,res) => {
    console.log(req.body)
    res.status(200).send("register")
})


module.exports = Router