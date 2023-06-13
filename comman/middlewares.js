const jwt = require('jsonwebtoken')
const userModel = require('../models/users')
// for logs to write in logger file
const CommonFunctions = require('../comman/functions');
const commonFn = new CommonFunctions();
const appJsLog = commonFn.Logger('appJs')
module.exports = {

    authentication: async function (req, res, next) {
        try {
            // console.log("=----------------")
            let { token } = req.headers
            // if token is not in request headers
            if (!token) {
                return res.json({
                    type: "error",
                    status: 409,
                    message: "token required for authentication !"
                })
            }
            // console.log("token = = > >", token);
            let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
                if (error) {
                    // console.log("===>>")
                    console.log({
                        message: error.message,
                    })
                }
                return decoded
            })
            // console.log("decoded = = > >", decoded);
            // console.log("req.headers----req.headers==>", req.headers.token)
            // console.log("decoded", decoded)
            req.user = await userModel.findById(decoded._id)
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
            // appJsLog.error(" error at jwt token verification", error);
            return res.json({
                type: "error",
                status: 409,
                message: "invalid token"
            })
        }
        return next()
    },

    logIpOfRequest: async function (req, res, next) {
        appJsLog.info("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = > > Ip : ", req.ip)
        console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = > > Ip : ", req.ip)
        return next()
    },

    addTwo: async function (a, b) {
        console.log(a + b)
        // return next()
    }


}
