var express = require("express");
var router = express.Router();
var vendorModel = require("../models/vendors");
var newsModel = require("../models/newletter");
var advertisementModel = require('../models/advertisements')
var offerModel =require('../models/offers')
var emailValidator = require("deep-email-validator")
// 1.import node mailer
var nodemailer = require("nodemailer");

// for e.g /vendors
router.get("/vendors", async function (req, res, next) {
  try {
    let vendors = await vendorModel.find({});
    res.json({
      type: "success",
      status: 200,
      message: `All vendors`,
      data: vendors,
    });
  } catch (error) {
    console.log("error at /products/vendors --> index.js route", error);
    res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/vendors API `,
    });
  }
});

// post route to register user and send mail about registration
router.post("/signup", async function (req, res, next) {
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
    // await transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + req.body.userEmail);
    //   }
    // });

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

module.exports = router;
