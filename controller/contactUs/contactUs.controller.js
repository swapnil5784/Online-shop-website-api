// models
const contactUsModel = require('../../models/contactUs.js')

// To save message of user even if not register
const contactUsController = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body
        // console.log(name , email , message , subject, req.user._id.toString())
        let contactObject = {
            name: name,
            email: email,
            subject: subject,
            message: message
        }
        // query to store details got in body
        let contactConfirmation = await contactUsModel.create(contactObject)
        console.log(contactConfirmation)
        return res.json({
            type: "success",
            status: 200,
            message: "Message successfully stored !"
        })
    }
    catch (error) {
        // if error in contact-us process
        console.log("error in contactUsController controller", error)
        return res.json({
            type: "error",
            status: 500,
            message: "Server error at /contact-us route !"
        })
    }
}
module.exports = {
    contactUsController,
}