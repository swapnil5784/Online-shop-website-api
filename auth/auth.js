const passport = require('passport');
const passportJWT = require("passport-jwt");
const usersModel = require('../models/users')
const md5 = require('md5')

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
},
    async function (email, password, cb) {
        // console.log(`{email:${email},password:${md5(password)}}`)
        //Assume there is a DB module pproviding a global UserModel
        return await db.models.users.findOne({
            email: email, password: md5(password)
        }).then(user => {
            if (!user) {
                return cb(null, false, {
                    type: "error",
                    status: 409,
                    message: "Login failed , entered  details are not correct ! ",
                });
            }
            // console.log("user = = > >", user)
            return cb(null, user, {
                message: 'Logged In Successfully'
            });
        })
            .catch(error => {
                return cb(error);
            });
    }
));
