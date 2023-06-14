// To logout user from application
const userLogout = function (req, res, next) {
    try {
        req.logout();
        return res.json({
            type: "success",
            status: 400,
            message: 'Logged out successful !'
        })
    }
    catch (error) {
        console.log('error while logout', error)
        return res.json({
            type: 'error',
            status: 500,
            message: "Error while logout !"
        })
    }
}

// export function
module.exports = {
    userLogout
}