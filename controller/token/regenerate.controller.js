// packages
const jwt = require('jsonwebtoken')

// To regenerate the token 
const regerateToken = async function (req, res, next) {
    try {
        // token register with _id , email and name with secret key and expiry time as mentioned in .env file
        const token = jwt.sign({ _id: req.user._id, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY_TIME });
        return res.json({
            type: "success",
            status: 200,
            token: token,
            message: "Successfully rengenerated token ."
        })
    }
    catch (error) {
        // if error in regerate token
        console.log('error in /token-renew route at index.js', error)
        return res.json({
            type: "error",
            status: 500,
            message: "Server error at /token-review !"
        })
    }
}

// exports
module.exports = {
    regerateToken
}