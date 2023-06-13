
const CommonFunctions = require('../../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

// import models
var productModel = require("../../models/products");

const getProductFilter  = async function (req, res, next) {
    try {
      let maxPriceDetails = await productModel.aggregate([
        {
          $group: {
            _id: null,
            MaximumPrice: { $max: "$price" },
            MinimumPrice: { $min: "$price" },
          },
        },
      ]);
      let priceRanges = [];
      for (
        let i = Math.floor(maxPriceDetails[0].MinimumPrice);
        i < Math.ceil(maxPriceDetails[0].MaximumPrice);
        i = i + 100
      ) {
        priceRanges.push({
          min: i,
          max: i + 100,
          totalProducts: await productModel.countDocuments({
            $and: [{ price: { $gte: i } }, { price: { $lte: i + 100 } }],
          }),
        });
      }
      let colorsArray = await productModel.aggregate([
        {
          $group: {
            _id: "$color",
            totalProducts: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            color: "$_id",
            totalProducts: 1,
          },
        },
      ]);
  
      let sizesArray = await productModel.aggregate([
        {
          $group: {
            _id: "$size",
            totalProducts: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            size: "$_id",
            totalProducts: 1,
          },
        },
      ]);
      if (!colorsArray?.length && !sizesArray?.length && !priceRanges?.length) {
        return res.json({
          type: "error",
          status: 404,
          message: "No filters found !",
          data: {
            colors: colorsArray,
            sizes: sizesArray,
            priceRanges: priceRanges,
          },
        })
      }
      return res.json({
        type: "success",
        status: 200,
        message: `response from /products/filters to render filter details`,
        data: {
          colors: colorsArray,
          sizes: sizesArray,
          priceRanges: priceRanges,
        },
      });
    } catch (error) {
      productLog.error("error at GET /products/filters route...", error)
      console.log("error at get /products/filters route...", error);
      return res.json({
        type: "error",
        status: 500,
        message: `Server error at /products/filters API `,
      });
    }
  }

  module.exports ={
    getProductFilter
  }