// packages
const md5 = require('md5');
const authenticationLog = commonFn.Logger('authentication')
// middleware
const authService = require('../../service/authentication');

// To register the user details in db
const registerUser = async function (req, res) {
  try {
    const { name, email, country, password, mobile, timezone, language } = req.body;

    // if any field missing in body
    if (!name || !email || !country || !password || !mobile || !timezone || !language) {
      authenticationLog.error(`Not complete details ! User registration failed !`,)
      return res.json({
        type: "error",
        status: 409,
        message: `Not complete details ! User registration failed !`,
      });
    }
    // if emailId or mobile already registered
    let userFound = await authService.findUserByIdOrMobile(email, mobile);
    if (userFound) {
      authenticationLog.error(`User already registred with entered details ! User registration failed !`)
      return commonFn.sendErrorResponse(res, 409, `User already registred with entered details ! User registration failed !`)
    }
    // register user in database
    let userBody = {
      name: name,
      email: email,
      password: md5(password),
      country: country,
      mobile: mobile,
      timezone: timezone,
      language: language,
      profileImage: "/images/default/user.png"
    };
    await authService.createUser(userBody);
    return commonFn.sendSuccessResponse(res, `User registration done.`)
  }
  catch (error) {
    // if error in user registration process
    authenticationLog.error("error post: /register --> index.js route", error)
    console.log("error post: /register --> index.js route", error);
    return commonFn.sendErrorResponse(res, 500, `User registration failed !`)
  }
};

// export function
module.exports = {
  registerUser,
};