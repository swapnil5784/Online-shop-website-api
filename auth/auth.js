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
        // console.log(`{email:${email},password:${password}}`)
        //Assume there is a DB module pproviding a global UserModel
      return usersModel.findOne({
            email:email,password:md5(password)
        }).then(user => {
            if (!user) {
                    return cb(null, false, {
                        message: "invalid credentials auth/auth.js line:29",
                      });
                }
                return cb(null, user, {
                    message: 'Logged In Successfully'
                });
            })
            .catch(error => {
                return cb(error);
            });
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'swapnil'
},
    function (jwtPayload, cb) {
        console.log(jwtPayload)
        //find the user in db if needed
        return usersModel.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));