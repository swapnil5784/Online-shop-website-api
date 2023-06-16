
// 1. import node mailer
var nodemailer = require("nodemailer");
var emailValidator = require("deep-email-validator")

// 2.define transporter
var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.SEND_MAIL_SERVICE_AUTH_USER,
        pass: process.env.SEND_MAIL_SERVICE_AUTH_PASSWORD_TOKEN,
    },
});

module.exports = {
    sendMail: async (email, subject, textContent) => {
        // check email in reality exists or not 
        async function isEmailValid(email) {
            return emailValidator.validate(email)
        }
        const { valid } = await isEmailValid(email)
        // valid ==> true or false
        console.log("Email in reality exists or not ====> ", valid);
        // 3. mail option
        var mailOptions = {
            from: process.env.SEND_MAIL_SERVICE_AUTH_USER,
            to: email,
            subject: subject,
            text: textContent,
        };
        // 4. send email with mail options
        if (valid) {
            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + email);
                }
            });
        }

    }
}