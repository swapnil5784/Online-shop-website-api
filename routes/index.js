var express = require("express");
var router = express.Router();
var vendorModel = require("../models/vendors");
var userModel = require("../models/users");
// 1.import node mailer
var nodemailer = require("nodemailer");
/* GET users listing. */
// for e.g /poster
router.get("/poster", function (req, res, next) {
  try {
    let carousels = [
      {
        title: "Men Fashion",
        description:
          "Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam",
        image: "/images/carousel/carousel-1.jpg",
        btnName: "Shop Now",
      },
      {
        title: "Women Fashion",
        description:
          "Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam",
        image: "/images/carousel/carousel-2.jpg",
        btnName: "Shop Now",
      },
      {
        title: "Kids Fashion",
        description:
          "Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam",
        image: "/images/carousel/carousel-3.jpg",
        btnName: "Shop Now",
      },
    ];

    let offers = [
      {
        offerTitle: "SAVE 20%",
        offerType: "Special Offer",
        image: "/images/offers/offer-1.jpg",
        btnName: "Shop Now",
      },
      {
        offerTitle: "SAVE 20%",
        offerType: "Special Offer",
        image: "/images/offers/offer-2.jpg",
        btnName: "Shop Now",
      },
    ];
    
    res.json({
      type: "success",
      status: 200,
      message: `for /banner route`,
      data: {
        carousels: carousels,
        offers: offers,
      },
    });
  } catch (error) {
    console.log("error at /banner route", error);
    res.json({
      type: "error",
      status: 500,
      message: `Server error at /banner API `,
    });
  }
});

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

    let isEmailExists = await userModel.findOne({userEmail:req.body.userEmail})
    if(isEmailExists){
        return res.json({
            type: "error",
            status: 409,
            message: "Email already registred !",
          });
    }

    await userModel.create(req.body)

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
