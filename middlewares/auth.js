const jwt = require('jsonwebtoken')
const userModel = require('../models/users')
module.exports = async function (req, res, next) {

    // console.log("req.headers----req.headers==>", req.headers.token)
    let { token } = req.headers
    // if token is not in request headers
    if (!token) {
        return res.json({
            type: "error",
            status: 409,
            message: "token required for authentication !"
        })
    }
    let decoded = jwt.verify(token, 'swapnil')
    console.log("decoded", decoded)
    global.user = await userModel.findById(decoded._id)
    // if decoded user _id not found in db
    if (!user) {
        return res.json({
            type: "error",
            status: 409,
            message: "invalid token"
        })
    }
    // console.log("user--user",user);
    return next()
};
