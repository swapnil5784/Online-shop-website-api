var express = require("express");
var router = express.Router();
var vendorModel = require("../models/vendors");
var newsModel = require("../models/newsletter");
var advertisementModel = require('../models/advertisements')
var offerModel = require('../models/offers')
var usermodel = require('../models/users')
var emailValidator = require("deep-email-validator")
var md5 = require('md5')

const jwt = require('jsonwebtoken');
const passport = require('passport');
const { authentication } = require('../comman/middlewares')
// 1.import node mailer
var nodemailer = require("nodemailer");
const { registerUser } = require("../controller/auth/register.controller");

//for e.g POST : /register
router.post('/register', registerUser)

// for e.g POST : /login
router.post('/login', async function (req, res, next) {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed , entered details are not correct ! ',
          user: user
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        const token = jwt.sign({ _id: req.user._id, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
        console.log("user = = > > 3000 :", user)
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
    console.log("error post: /login --> index.js route", error);
    return res.json({
      type: "error",
      status: 500,
      message: `User registration failed !`,
    })
  }
})

// for e.g GET : /logout
router.get('/logout', function (req, res, next) {
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
})

// for e.g /vendors
router.get("/vendors", async function (req, res, next) {
  try {
    let vendors = await vendorModel.find({});
    if (!vendors.length) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: `No vendors found`,
        data: vendors,
      });
    }
    return res.status(200).json({
      type: "success",
      status: 200,
      message: `All vendors from /vendors`,
      data: vendors,
    });
  } catch (error) {
    console.log("error at /products/vendors --> index.js route", error);
    return res.status(200).json({
      type: "error",
      status: 500,
      message: `Server error at /vendors API `,
    });
  }
});

// post route to register user and send mail about registration
router.post("/subscribe", async function (req, res, next) {
  try {

    console.log("----------------------> req.body", req.body.userEmail);
    let isEmailExists = await newsModel.findOne({ userEmail: req.body.userEmail })
    if (isEmailExists) {
      return res.status(200).json({
        type: "error",
        status: 200,
        message: "Email registred for updates!",
      });
    }

    await newsModel.create(req.body)

    // 2.define transporter
    var transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: "swapnil.mycircle@gmail.com",
        pass: "lxoldjnefineriei",
      },
    });
    let emailToValidate = req.body.userEmail

    // check email in reality exists or not 
    async function isEmailValid(email) {
      return emailValidator.validate(email)
    }

    const { valid } = await isEmailValid(emailToValidate)
    // valid ==> true or false
    console.log("Email in reality exists or not ====> ", valid);

    // 3. mail option
    var mailOptions = {
      from: "swapnil.mycircle@gmail.com",
      to: req.body.userEmail,
      subject: "Newsletter Email",
      text: "Congradulations ! You have successfully registered on Multi-Shop Online E-store ( angular-node joint venture)",
    };

    // 4. send email with mail options
    if (valid) {
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + req.body.userEmail);
        }
      });
    }
    return res.status(200).json({
      type: "success",
      status: 200,
      message: "successfully registered !",
    });
  } catch (error) {
    console.log("error at post /subscribe route in index.js", error);
    return res.status(500).json({
      type: "error",
      status: 500,
      message: "server error at post /subscribe route",
    });
  }
});

// for e.g /advertisements
router.get("/advertisements", async function (req, res, next) {
  try {

    let advertisements = await advertisementModel.find({});

    let offers = await offerModel.find({})
    if (!offers.length && !advertisements.length) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: `No advertisements or offer found !`,
        data: {
          carousels: advertisements,
          offers: offers,
        },
      });
    }
    return res.status(200).json({
      type: "success",
      status: 200,
      message: `For /advertisements route`,
      data: {
        carousels: advertisements,
        offers: offers,
      },
    });
  } catch (error) {
    console.log("error at /banner route", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /banner API `,
    });
  }
});

router.post('/generate-token', authentication, async function (req, res, next) {
  try {
    const token = jwt.sign({ _id: req.user._id, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
    res.status(200).json({
      type: "success",
      status: 200,
      token: token,
      message: "Successfully rengenerated token ."
    })
  }
  catch (error) {
    console.log('error in /token-renew route at index.js', error)
    res.status(500).json({
      type: "error",
      status: 500,
      message: "Server error at /token-review !"
    })
  }
})

module.exports = router;
