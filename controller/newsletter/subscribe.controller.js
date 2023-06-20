
const newsModel = require('../../models/newsletter')

// packages
const emailValidator = require("deep-email-validator")

// services
const emailService = require('../../common/sendmail')

// 1. import node mailer
const nodemailer = require("nodemailer");

// To send email which got in body about updates in products , offers etc
const subscribeToNewsletter = async function (req, res, next) {
    try {
        // query to find email passed with that email already exists in db 
        let isEmailExists = await db.models.newsletter.findOne({ userEmail: req.body.userEmail }).lean()
        // if email already exists
        if (isEmailExists) {
            return res.json({
                type: "success",
                status: 200,
                message: "Email registred for updates!",
            });
        }
        // query to store email in db
        await db.models.newsletter.create(req.body)
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