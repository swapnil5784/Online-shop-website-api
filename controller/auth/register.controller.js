
const authService = require('../../service/auth/auth.service')

const registerUser = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, country, password, mobile, timezone, language } = req.body

    // if any field missing in body
    if (!name || !email || !country || !password || !mobile || !timezone || !language) {
      return res.json({
        type: "error",
        status: 409,
        message: `Not complete details ! User registration failed !`,
      })
    }

    // if emailId or mobile already registered
    let userFound = await authService.findUserByIdorMobile(email, mobile)
    console.log(userFound, "userFound....");

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
    await authService.createUser(userBody)
    return res.json({
      type: "success",
      status: 200,
      message: `User registration done.`,
    });
  }
  catch (error) {
    console.log("error post: /register --> index.js route", error);
    return res.json({
      type: "error",
      status: 500,
      message: `User registration failed !`,
    });
  }
}

module.exports = {
  registerUser
}