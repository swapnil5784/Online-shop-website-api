// packages
const handlebars = require('hbs')
const moment = require('moment')
const md5 = require('md5')
const fs = require('fs')

// services
const forgetService = require('../../service/auth/forgot.service')
const otpGenerator = require('otp-generator')
const emailService = require('../../common/sendmail')

// To send 6 character OTP to email received in body if email exist in db
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        // if user with email in body not found
        if (!await forgetService.userWithEmailExists(email)) {
            return res.json({
                type: "error",
                status: 404,
                message: "User not found"
            })
        }
        // generate random 6 character string as resetOtp
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false })
        // set time 5 minutes ahead of now
        // let otpExpireAt = moment().add(5, 'minutes').utc('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss')
        let otpExpireAt = moment().add(5, 'minutes')
        // setting resetOtp and expiration time in userModel
        await forgetService.addResetOtpAndExpirytimeFieldToUser(email, otp, otpExpireAt)
        // read html file in utf-8 encoding
        let readFile = fs.readFileSync('htmlTemplate/mail.hbs', { encoding: 'utf-8' })
        // compile as template
        const template = handlebars.compile(readFile);
        // replace Object for variable replacement in email sending
        const replacements = {
            resetOtp: otp,
            email: email,
        };
        const htmlToSend = template(replacements);
        await emailService.sendMail(email, "OTP for reset password !", htmlToSend)
        return res.json({
            type: 'success',
            // data: {
            //     resetOtp: otp,
            //     otpExpiredAt: otpExpireAt
            // },
            status: 200,
            message: `Please enter otp which we have send to your email: ${email}`
        })
    }
    catch (error) {
        // if error while sending otp to email
        console.log("error at post: /forgot", error)
        return res.json({
            type: 'error',
            status: 500,
            message: "Server errro at /forgot !"
        })
    }
}

//To update password by verifying otp sent and its expiry time
const resetPassword = async (req, res) => {
    try {
        const { email, resetOtp, newPassword } = req.body
        let userDetails = await forgetService.findUser(email)

        // if any required field not found in body
        if (!email || !resetOtp || !newPassword) {
            return res.json({
                type: 'error',
                status: 409,
                message: "Incomplete details !"
            })
        }

        // time exceeds the otp-expiration time
        if (!(userDetails.otpExpiredAt > moment())) {
            return res.json({
                type: 'error',
                status: 409,
                message: "Invalid OTP !"

            })
        }

        // check otp is same as generated
        if (!(userDetails.resetOtp === resetOtp)) {
            return res.json({
                type: 'error',
                status: 409,
                message: "Invalid OTP !"
            })
        }
        // query to update password in db 
        await forgetService.updatePassword(email, resetOtp, newPassword)
        return res.json({
            type: 'success',
            status: 300,
            message: "Password reset successfully !"
        })
    }
    catch (error) {
        // if error in pass reset process
        console.log("error at post: /forgot", error)
        return res.json({
            type: 'error',
            status: 500,
            message: "Server errro at /forgot !"
        })
    }
}
module.exports = {
    forgotPassword,
    resetPassword,
}

