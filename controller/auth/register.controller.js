// packages
var emailValidator = require("deep-email-validator")
const emailChecker = require('email-existence')
const md5 = require('md5')

// middleware
const authService = require('../../service/auth/auth.service')



// To register the user details in db
const registerUser = async function (req, res) {
  try {
    const { name, email, country, password, mobile, timezone, language } = req.body

    // if any field missing in body
    if (!name || !email || !country || !password || !mobile || !timezone || !language) {
      return res.json({
        type: "error",
        status: 409,
        message: `Not complete details ! User registration failed !`,
      })
    }
    //--------------------------email exists or not

    // check email in reality exists or not 
    let isEmailValid = async function (email) {
      return emailValidator.validate(email)
    }
    const { valid } = await isEmailValid(email)
    console.log("Email in reality exists or not ====> ", valid);

    //------------------------------------------
    console.log('valid = = > >', valid)
    // if email in registration details in reality not exist
    if (!valid) {
      return res.json({
        type: "error",
        status: 409,
        message: `Enter email that exists in real !`,
      })
    }
    // if emailId or mobile already registered
    let userFound = await authService.findUserByIdorMobile(email, mobile)
    // console.log(userFound, "userFound....");
    if (userFound) {
      return res.json({
        type: "error",
        status: 409,
        message: `User already registred with entered details ! User registration failed !`,
      })
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
    }
    // await authService.createUser(userBody)
    return res.json({
      type: "success",
      status: 200,
      message: `User registration done.`,
    });
  }
  catch (error) {
    // if error in user registration process
    console.log("error post: /register --> index.js route", error);
    return res.status(500).json({
      type: "error",
      status: 500,
      message: `User registration failed !`,
    });
  }
}

// export function
module.exports = {
  registerUser,

}