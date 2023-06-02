var express = require("express");
var router = express.Router();
var vendorModel = require("../models/vendors");
var newsModel = require("../models/newsletter");
var advertisementModel = require('../models/advertisements')
var offerModel =require('../models/offers')
var usermodel = require('../models/users')
var emailValidator = require("deep-email-validator")
var md5 = require('md5')

const jwt      = require('jsonwebtoken');
const passport = require('passport');

// 1.import node mailer
var nodemailer = require("nodemailer");

//for e.g POST : /register
router.post('/register',async function(req,res,next){
  try{
    console.log(req.body)
    const {name,email,country,password,mobile,timezone,language} = req.body

    // if any field missing in body
    if( !name  || !email || !country || !password  || !mobile || !timezone || !language){
      return res.json({
        type: "error",
        status: 409,
        message: `Not complete details ! User registration failed !`,
      })
    }

    // if emailId or mobile already registered
    let userFound = await usermodel.countDocuments({$or:[{email:email},{mobile:mobile}]})
    if(userFound){
      return res.json({
        type: "error",
        status: 409,
        message: `User already registred with entered details ! User registration failed !`,
      })
    }
    // register user in database
    await usermodel.create({
      name:name,
      email:email,
      password:md5(password),
      country:country,
      mobile:mobile,
      timezone:timezone,
      language:language,
      profileImage:"/images/default/user.png"
    })
    return res.json({
      type: "success",
      status: 200,
      message: `User registration done.`,
    });
  }
  catch(error){
    console.log("error post: /register --> index.js route", error);
    return res.json({
      type: "error",
      status: 500,
      message: `User registration failed !`,
    });
  }
})

// for e.g POST : /login
router.post('/login',async function(req,res,next){
  try{
    passport.authenticate('local', {session: false}, (err, user, info) => {
      // console.log(err);
      if (err || !user) {
          return res.status(400).json({
              message: info ? info.message : 'Login failed',
              user   : user
          });
      }

      req.login(user, {session: false}, (err) => {
        if (err) {
              res.send(err);
          }

          const token = jwt.sign({_id:user._id,
          email:user.email} ,'swapnil');
          return res.json({
            type:"success",
            status:400,
            message:"successfully login",
            token:token
          });
      });
  })
  (req, res);
  }
  catch(error){
    console.log("error post: /login --> index.js route", error);
    return res.json({
      type: "error",
      status: 500,
      message: `User registration failed !`,
      })
   }
})

// for e.g /vendors
router.get("/vendors", async function (req, res, next) {
  try {
    let vendors = await vendorModel.find({});
    return res.json({
      type: "success",
      status: 200,
      message: `All vendors from /vendors`,
      data: vendors,
    });
  } catch (error) {
    console.log("error at /products/vendors --> index.js route", error);
    return res.json({
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

    let isEmailExists = await newsModel.findOne({userEmail:req.body.userEmail})
    if(isEmailExists){
        return res.json({
            type: "error",
            status: 409,
            message: "Email already registred !",
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
    let emailToValidate =req.body.userEmail

    // check email in reality exists or not 
      async function isEmailValid(email){
        return emailValidator.validate(email)
    }

    const {valid} = await isEmailValid(emailToValidate)
    // valid ==> true or false
    console.log("Email in reality exists or not ====> ",valid);

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
    return res.json({
      type: "success",
      status: 200,
      message: "successfully registered !",
    });
  } catch (error) {
    console.log("error at post /signup route in index.js", error);
    return res.json({
      type: "error",
      status: 500,
      message: "server error at post /signup route",
    });
  }
});

// for e.g /advertisements
router.get("/advertisements",async function (req, res, next) {
  try {

    let advertisements = await advertisementModel.find({});
    
    let offers = await offerModel.find({})

    return res.json({
      type: "success",
      status: 200,
      message: `for /advertisements route`,
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


module.exports = router;
