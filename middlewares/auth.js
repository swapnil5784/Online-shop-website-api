const jwt = require('jsonwebtoken')
const jwtauth =function(req,res,next){

    // console.log("req.headers----req.headers==>",req.headers.token)
    let decoded = jwt.verify(req.headers.token,'swapnil')
    console.log("decoded",decoded)
    
    return res.json({
        type:"error",
        status:409,
        message:"invalid token"
    })
    return next()
}

module.exports = jwtauth;