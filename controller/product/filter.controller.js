// common functions
const CommonFunctions = require('../../common/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

// import models
const productModel = require("../../models/products");

// services
const productServices = require('../../service/product.service')

const getProductFilter = async function (req, res, next) {
  try {
    // query get price ranges maximum and minimum 
    let maxPriceDetails = await productServices.findMaximumAndMinumumProductPrice();
    // below loop is to create an array ranges of 100 in [ MinimumPrice ,  MaximumPrice ]
    let priceRanges = [];
    for (
      let i = Math.floor(maxPriceDetails[0].MinimumPrice);
      i < Math.ceil(maxPriceDetails[0].MaximumPrice);
      i = i + 100
    ) {
      let productsInRange = await productServices.productsInPriceRange(i, i + 100)
      if (productsInRange) {
        priceRanges.push({
          min: i,
          max: i + 100,
          totalProducts: productsInRange,
        });
      }
    }
    // query to get the colors list of product in collection
    let colorsArray = await productServices.colorsAvailableInProducts();
    // query to get the colors size of product in collection
    let sizesArray = await productServices.sizesAvailableInProducts();
    // if colorsList , sizeList and priceRangeList are empty
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
    // if errot while sending fileters of products
    productLog.error("error at GET /products/filters route...", error)
    console.log("error at get /products/filters route...", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/filters API `,
    });
  }
}

// export function
module.exports = {
  getProductFilter
}