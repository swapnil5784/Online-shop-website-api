var express = require("express");
var router = express.Router();
var advertisementModel = require('../models/advertisements')
var offerModel =require('../models/offers')


// for e.g /advertisements
router.get("/",async function (req, res, next) {
  try {

    let advertisements = await advertisementModel.find({});
    
    let offers = await offerModel.find({})

    res.json({
      type: "success",
      status: 200,
      message: `for /banner route`,
      data: {
        carousels: advertisements,
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


module.exports = router;
