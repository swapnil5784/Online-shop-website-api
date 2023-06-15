// packages
const md5 = require('md5')

// models
const userModel = require('../../models/users')

// To check user with mentioned email exists or not
const userWithEmailExists = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await userModel.countDocuments({ email: email })
            resolve(data)
        }
        catch (error) {
            console.log("error at forgot service", error)
            reject(error)
        }
    })
}

// To update user document with otp and its expiry time
const addResetOtpAndExpirytimeFieldToUser = async (email, otp, otpExpireAt) => {
    return new Promise(async (resolve, reject) => {
        try {
            let updateMessage = await userModel.updateOne({ email: email }, { resetOtp: otp, otpExpiredAt: otpExpireAt })
            resolve(updateMessage)
        }
        catch (error) {
            console.log("error at addResetOtpAndExpirytime in forgot service  ", error)
            reject(error)
        }
    })
}

// To find user with email mentioned
const findUser = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await userModel.findOne({ email: email })
            resolve(user)
        }
        catch (error) {
            console.log("error in findUser at forgot service !", error)
            reject(error)
        }
    })
}

// TO update userDetail in collection
const updatePassword = async (email, resetOtp, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let message = await userModel.updateOne({ email: email, resetOtp: resetOtp }, { password: md5(newPassword) })
            resolve(message)
        }
        catch (error) {
            console.log('error at updatePassword in forgot service !', error)
            reject(error)
        }
    })
}
// exports
module.exports = {
    userWithEmailExists,
    addResetOtpAndExpirytimeFieldToUser,
    findUser,
    updatePassword
}

