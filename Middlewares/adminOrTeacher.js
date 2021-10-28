const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path:path.join(__dirname,'../','.env')
})

const verify = (req,res,next) => {
    try{
        const auth = req.headers['authorization']
        const authToken = auth.split(" ")[1]
        const result =  jwt.verify(authToken,process.env.key)
        if(result.role === 'teacher' || result.role === 'admin'){
            next()
        }else{
            res.json({ok:false,msg:"Not Authorised"})
        }
    }catch(err){
        res.json({ok:false,msg:"Not Authorised"})
    }
}

module.exports = verify