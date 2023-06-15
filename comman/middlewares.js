
// packages
const jwt = require('jsonwebtoken')
const moment = require('moment')

// models
const userModel = require('../models/users')

// For logs to write in logger file
const CommonFunctions = require('../comman/functions');
const commonFn = new CommonFunctions();
const appJsLog = commonFn.Logger('appJs')

// Export functions as object's key
module.exports = {
    // Middleware function to authenticate every request by verifying token
    authentication: async function (req, res, next) {
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
            // verify token and return decoded information in token
            let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
                if (error) {
                    console.log({
                        message: error.message,
                    })
                }
                return decoded
            })
            // asign request user's details
            req.user = await userModel.findById(decoded._id)
            // if decoded user _id not found in db
            if (!req.user) {
                return res.json({
                    type: "error",
                    status: 401,
                    message: "invalid token"
                })
            }
        }
        catch (error) {
            // if error in authentication process
            return res.json({
                type: "error",
                status: 409,
                message: "invalid token"
            })
        }
        return next()
    },

    // Middleware function to console ip and time of request passed in server
    logIpOfRequest: async function (req, res, next) {
        appJsLog.info("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = > > Ip : ", req.ip)
        console.log("= = = = = = = = = = = = = = = = = = = = = = > > Ip : ", req.ip, " ", moment(req._startTime).format("DD:MM:YYYY h:mm:ss"))
        console.log()
        return next()
    },


}
