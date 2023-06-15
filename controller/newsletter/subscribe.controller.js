
const newsModel = require('../../models/newsletter')

// packages
var emailValidator = require("deep-email-validator")


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

        // 2.define transporter
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

        let emailToValidate = req.body.userEmail

        // check email in reality exists or not 
        async function isEmailValid(email) {
            return emailValidator.validate(email)
        }

        const { valid } = await isEmailValid(emailToValidate)
        // valid ==> true or false
        console.log("Email in reality exists or not ====> ", valid);

        // 3. mail option
        var mailOptions = {
            from: "swapnil.mycircle@gmail.com",
            to: req.body.userEmail,
            subject: "Newsletter Email",
            text: "Congradulations ! You have successfully registered on Multi-Shop Online E-store ( angular-node joint venture)",
        };

        // 4. send email with mail options
        if (valid) {
            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + req.body.userEmail);
                }
            });
        }
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