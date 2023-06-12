
const userModel = require('../../models/users')
const forgetService = require('../../service/auth/forgot.service')
const otpGenerator = require('otp-generator')
const handlebars = require('hbs')
const moment = require('moment')
const md5 = require('md5')
const fs = require('fs')
// 1. import node mailer
var nodemailer = require("nodemailer");
// 2. node transporter
var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "swapnil.mycircle@gmail.com",
        pass: "lxoldjnefineriei",
    },
});

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        console.log("email = = > >", email)
        console.log(await forgetService.userWithEmailExists(email))

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
        let otpExpireAt = moment().add(5, 'minutes').utc('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss')
        // setting resetOtp and expiration time in userModel
        await forgetService.addResetOtpAndExpirytimeFieldToUser(email, otp, otpExpireAt)

        // for html variable replacements-----------------

        // fs.readFile('htmlTemplate/mail.html', async function (err, html) {
        //     if (err) {
        //         console.log('error reading file', err);
        //         return;
        //     }

        let readFile = fs.readFileSync('htmlTemplate/mail.hbs', { encoding: 'utf-8' })
        var template = handlebars.compile(readFile);
        // console.log("template = = >", template)
        var replacements = {
            resetOtp: otp,
            email: email,
            otpExpireAt: otpExpireAt

        };
        var htmlToSend = template(replacements);


        // 3. mailoptions
        var mailOptions = {
            from: "swapnil.mycircle@gmail.com",
            to: email,
            subject: "OTP for reset password !",
            html: htmlToSend,
            text: `Reset OTP : ${otp} ,will expire At ${otpExpireAt}`,
        };
        //4. send mail by transporter
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error in node-mailer send mail !", error);
            } else {
                console.log("Reset OTP send to : " + email);
            }
        });


        // })
        //-------------------------------------------------------
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
        console.log("error at post: /forgot", error)
        return res.json({
            type: 'error',
            status: 500,
            message: "Server errro at /forgot !"
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, resetOtp, newPassword } = req.body
        console.log("email = = > >", email, "resetOtp = = > >", resetOtp, " newPassword = = > >", newPassword, md5(newPassword))
        let userDetails = await forgetService.findUser(email)

        // time exceeds the otp-expiration time
        if (!(userDetails.otpExpiredAt > moment().utc('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss'))) {
            return res.json({
                type: 'error',
                status: 409,
                message: "Reset Otp Expired!"

            })
        }
        // if any required field not found in body
        if (!email || !resetOtp || !newPassword) {
            return res.json({
                type: 'error',
                status: 409,
                message: "Incomplete details !"
            })
        }
        // check otp is same as generated
        if (!(userDetails.resetOtp === resetOtp)) {
            return res.json({
                type: 'error',
                status: 409,
                message: "Reset-Otp mismatched !"
            })
        }
        console.log(`(${userDetails.otpExpiredAt} > ${moment().utc('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss')})`, (userDetails.otpExpiredAt > moment().utc('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss')))


        let resetPassword = await forgetService.updatePassword(email, resetOtp, newPassword)
        return res.json({
            type: 'success',
            status: 300,
            message: "Successfully password reset!"
        })
    }
    catch (error) {
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

