const jwt = require('jsonwebtoken')
const userModel = require('../models/users')
module.exports = async function (req, res, next) {
    try {
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
        console.log("req.headers----req.headers==>", req.headers.token)
        console.log("decoded", decoded)
        req.user = await userModel.findById(decoded._id)
        console.log("user=======> ", req.user);
        // if decoded user _id not found in db
        if (!req.user) {
            return res.json({
                type: "error",
                status: 409,
                message: "invalid token"
            })
        }
    }
    catch (error) {
        console.log(" error at jwt token verification", error);
        return res.json({
            type: "error",
            status: 409,
            message: "invalid token"
        })
    }
    return next()
};
