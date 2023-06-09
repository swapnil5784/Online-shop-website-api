// common functions
const CommonFunctions = require('../../common/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products');
const crypto = require('crypto')
// services
const productServices = require('../../service/product');

const getProductFilter = async function (req, res, next) {
  try {
    // query get price ranges maximum and minimum 
    let maxPriceDetails = await productServices.minMaxPrice();
    // below loop is to create an array ranges of 100 in [ MinimumPrice ,  MaximumPrice ]
    let priceRanges = [];
    for (
      let i = Math.floor(maxPriceDetails[0].MinimumPrice);
      i < Math.ceil(maxPriceDetails[0].MaximumPrice);
      i = i + 100
    ) {
      let productsInRange = await productServices.productsInPriceRange(i, i + 100);
      if (productsInRange) {
        priceRanges.push({
          min: i,
          max: i + 100,
          totalProducts: productsInRange,
        });
      }
    }
    // query to get the colors list of product in collection
    let colorsArray = await productServices.availableColors();
    // query to get the colors size of product in collection
    let sizesArray = await productServices.availableSizes();
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
      });
    }
    let dataObject =
    {
      colors: colorsArray,
      sizes: sizesArray,
      priceRanges: priceRanges,
    }
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    // let ivToEncryptIv = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 16);
    let encData = commonFn.encrypt(JSON.stringify(dataObject), key, iv);
    return res.json({
      type: "success",
      status: 200,
      message: `response from /products/filters to render filter details`,
      data: {
        colors: colorsArray,
        sizes: sizesArray,
        priceRanges: priceRanges,
      },
      newData: encData,
    });
  } catch (error) {
    // if errot while sending fileters of products
    productLog.error("error at GET /products/filters route...", error);
    console.log("error at get /products/filters route...", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/filters API `,
    });
  }
};

// export function
module.exports = {
  getProductFilter,
};