const regerateToken = async function (req, res, next) {
    try {
        const token = jwt.sign({ _id: req.user._id, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
        res.json({
            type: "success",
            status: 200,
            token: token,
            message: "Successfully rengenerated token ."
        })
    }
    catch (error) {
        console.log('error in /token-renew route at index.js', error)
        res.json({
            type: "error",
            status: 500,
            message: "Server error at /token-review !"
        })
    }
}

module.exports = {
    regerateToken
}