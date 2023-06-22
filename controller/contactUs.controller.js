
const contactLog = commonFn.Logger('contact')
const crypto = require('crypto')
// To save message of user even if not register
const contactUsController = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;
        // console.log(name , email , message , subject, req.user._id.toString())
        let contactObject = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };
        let key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
        let DecryptedData = commonFn.decrypt(req.body.data, key, req.body.iv)
        console.log("EcryptedData = = > >", req.body.data);
        console.log("DecryptedData = = > >", DecryptedData);
        // query to store details got in body
        await db.models.contactUs.create(contactObject);
        return res.json({
            type: "success",
            status: 200,
            message: "Message successfully stored !"
        });
    }
    catch (error) {
        // if error in contact-us process
        contactLog.error("error in contactUsController controller", error)
        console.log("error in contactUsController controller", error);
        return res.json({
            type: "error",
            status: 500,
            message: "Server error at /contact-us route !"
        });
    }
};
module.exports = {
    contactUsController,
};