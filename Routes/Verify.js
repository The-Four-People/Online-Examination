const express = require('express')
const jwt = require("jsonwebtoken")
const path = require('path')
const dotenv = require('dotenv')
const router = express.Router()


dotenv.config({
    path:path.join(__dirname,"../",'.env')
})


router.use(express.json())

router.post('/',(req,res) => {
    const { sec } = req.body
    jwt.verify(sec,process.env.key,function(err,data){
        if(err){
            res.json({ok:false,msg:"Cannot verify"})
        }else{
            res.json({ok:true,msg:"Successfully verified",data:data})
        }
    })
})

router.get('/',(req,res) => {
    res.sendStatus(404)
})

module.exports = router