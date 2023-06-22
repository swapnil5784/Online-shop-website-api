
// packages
const jwt = require('jsonwebtoken');

const validates = require('./validation');
// Export functions as object's key
module.exports = {
    // Middleware function to authenticate every request by verifying token
    authentication: async function (req, res, next) {
        try {
            let { token } = req.headers;
            // if token is not in request headers
            if (!token) {
                return res.json({
                    type: "error",
                    status: 409,
                    message: "token required for authentication !"
                })
            }
            // verify token and return decoded information in token
            let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
                if (error) {
                    console.log({
                        message: error.message,
                    });
                }
                return decoded;
            })
            // asign request user's details
            req.user = await db.models.users.findById(decoded._id);
            // if decoded user _id not found in db
            if (!req.user) {
                return res.json({
                    type: "error",
                    status: 401,
                    message: "invalid token"
                })
            }
        }
        catch (error) {
            // if error in authentication process
            return res.json({
                type: "error",
                status: 401,
                message: "invalid token"
            });
        }
        return next();
    },
    // 
    validations(modelName) {
        return function (req, res, next) {
            try {
                const model = validates[modelName];
                req.checkParams(model.params);
                req.checkBody(model.body);
                req.checkQuery(model.query);
                const errors = req.validationErrors();
                const validationErrors = {};
                if (errors) {
                    for (const inx in errors) {
                        if (validationErrors[errors[inx].param] == undefined) {
                            validationErrors[errors[inx].param] = errors[inx].msg;
                        }
                    }
                }
                // Check if validation error then return with error, otherwise go for next
                if (Object.keys(validationErrors).length > 0) {
                    return res.json({
                        type: "error",
                        message: "error",
                        status: 409,
                        validationErrors: validationErrors
                    });
                } else {
                    next();
                }
            } catch (error) {
                console.log("error", error);
            }

        };
    }

}
