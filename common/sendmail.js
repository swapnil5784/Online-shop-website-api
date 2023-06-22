
// 1. import node mailer
var nodemailer = require("nodemailer");

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
        // 3. mail option
        var mailOptions = {
            from: process.env.SEND_MAIL_SERVICE_AUTH_USER,
            to: email,
            subject: subject,
            html: textContent,
        };
        // 4. send email with mail options
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + email);
            }
        });
    }
}