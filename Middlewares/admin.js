const jwt = require("jsonwebtoken")
const path = require('path')
const dotenv = require('dotenv')


dotenv.config({
    path:path.join(__dirname,"../",'.env')
})


const verify = (req,res,next) => {
    try{
        const auth = req.headers['authorization']
        const authToken = auth.split(" ")[1]
        jwt.verify(authToken,process.env.key,function(err,data){
            if(data){
                if(data.role === "admin"){
                    next()
                }else{
                    res.json({ok:false,msg:"Not Authorised"})
                }
                // res.json({ok:true,msg:"Successfully verified",data:data})
            }else{
                res.json({ok:false,msg:"Not Authorised"})
            }
        })
    }catch(err){
        res.json({ok:false,msg:"An error occured"})
    }
}


module.exports = verify