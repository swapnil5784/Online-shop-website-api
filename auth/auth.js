const passport = require('passport');
const md5 = require('md5');

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
},
    async function (email, password, cb) {
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
            return cb(null, user, {
                message: 'Logged In Successfully'
            });
        })
            .catch(error => {
                return cb(error);
            });
    }
));
