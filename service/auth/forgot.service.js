const userModel = require('../../models/users')
const md5 = require('md5')

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
module.exports = {
    userWithEmailExists,
    addResetOtpAndExpirytimeFieldToUser,
    findUser,
    updatePassword
}

