
// packages
const jwt = require('jsonwebtoken');
const passport = require('passport');

const authenticationLog = commonFn.Logger('authentication')

// To login user and sign token 
const userLogin = async function (req, res, next) {
    try {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            // if user not found as details passed in body
            if (err || !user) {
                authenticationLog.error('Login failed , entered details are not correct ! ')
                return res.json({
                    message: info ? info.message : 'Login failed , entered details are not correct ! ',
                    user: user
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // sign jwt token by passing user's _id , email and name, a secret key and expiry time as mentioned in .env file
                const token = jwt.sign({ _id: req.user._id, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY_TIME });
                return res.json({
                    type: "success",
                    status: 200,
                    message: "successfully login",
                    token: token
                });
            });
        })
            (req, res);
    }
    catch (error) {
        // if error in user login process
        authenticationLog.error("error post: /login --> index.js route", error)
        console.log("error post: /login --> index.js route", error);
        return res.json({
            type: "error",
            status: 500,
            message: `User registration failed !`,
        });
    }
};

// export function
module.exports = {
    userLogin,
};