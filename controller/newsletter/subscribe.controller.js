
const newsModel = require('../../models/newsletter')

// packages
var emailValidator = require("deep-email-validator")

// services
const emailService = require('../../comman/sendmail')

// 1. import node mailer
var nodemailer = require("nodemailer");

// To send email which got in body about updates in products , offers etc
const subscribeToNewsletter = async function (req, res, next) {
    try {
        // query to find email passed with that email already exists in db 
        let isEmailExists = await newsModel.findOne({ userEmail: req.body.userEmail })
        // if email already exists
        if (isEmailExists) {
            return res.json({
                type: "success",
                status: 200,
                message: "Email registred for updates!",
            });
        }
        // query to store email in db
        await newsModel.create(req.body)
        let email = req.body.userEmail
        let subject = 'Registration successfull !'
        let content = "From email service  : Congradulations ! You have successfully registered on Multi-Shop Online E-store ( angular-node joint venture)"
        emailService.sendMail(email, subject, content)
        return res.json({
            type: "success",
            status: 200,
            message: "successfully registered !",
        });
    } catch (error) {
        console.log("error at post /subscribe route in index.js", error);
        return res.json({
            type: "error",
            status: 500,
            message: "server error at post /subscribe route",
        });
    }
}

module.exports = {
    subscribeToNewsletter
}