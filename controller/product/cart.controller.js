// packages
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// common function
const CommonFunctions = require('../../common/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products');


//services
const productService = require('../../service/product');

// To add and update cart as details passed in body
const addAndUpdateCart = async function (req, res, next) {
  try {
    let { productId, quantity, isAddedFromShop } = req.body
    // query to check if product is exist in product collection with mentioned productId
    let isProductExists = await productService.checkProductExistsById(productId);
    // if product not exist
    if (!isProductExists) {
      productLog.error("Product not found to add in cart !")
      return res.json({
        type: "error",
        status: 404,
        message: "Product not found !"
      });
    }
    let condition = {};
    // if product added from shop increment to product available in cart
    if (isAddedFromShop) {
      condition['$inc'] = {
        quantity: 1
      };
    } else {
      // else set number of product passed from checkout page of details page
      condition['$set'] = {
        quantity: parseInt(quantity)
      };
    }

    // used upsert if product is already in cart update else create a document
    await productService.updateOrInsertCart(req.user._id, productId, condition);
    return res.json({
      type: "success",
      status: 200,
      productsInCart: await db.models.carts.countDocuments({ userId: req.user._id }),
      message: `Product added to cart successfully`
    });
  }
  catch (error) {
    // if error in add to cart process
    productLog.error('Error in /products/cart route ', error);
    console.log('Error in /products/cart route ', error);
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /products/cart route'
    });
  }
};

// To remove product from cart with any number of quantity
const deleteCart = async function (req, res, next) {
  try {
    let { cartId } = req.params;
    productLog.info("Route : DELETE = products/review In:routes/product.js  ", "cartId => => ", cartId);
    // if cartId not found in params
    if (!cartId) {
      productLog.error(" Entered CartId not found !")
      return res.json({
        type: "error",
        status: 404,
        message: "CartId not found !"
      });
    }
    // cartId is not in ObjectId format
    if (!ObjectId.isValid(cartId)) {
      productLog.error(" Entered CartId is not valid !")
      return res.json({
        type: "error",
        status: 409,
        message: "CartIs not valid !"
      });
    }
    // query to remove product from cart
    await productService.deleteCart(cartId)
    return res.json({
      type: "success",
      status: 200,
      message: "Successfully removed from cart."
    });
  }
  catch (error) {
    // if error in process of removing product from cart
    productLog.error('Error in /cart route ', error);
    console.log('Error in /cart route ', error);
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /cart route'
    });
  }
};

// To send list of products in cart
const showCartproducts = async function (req, res, next) {
  try {
    productLog.info("Route : GET = products/review In:routes/product.js ", "req.user._id = = > ", req.user._id);
    // query to get products in cart
    let products = await productService.showCartProducts(req.user._id);
    // if no products in cart
    if (!products?.length) {
      productLog.error("No products in cart!")
      return res.json({
        type: "error",
        status: 404,
        message: "No products in cart!",
        data: {
          totalProductsInCart: products.length,
          products: products
        }
      });
    }
    return res.json({
      type: "success",
      status: 200,
      data: {
        totalProductsInCart: products.length,
        products: products
      }
    });
  }
  catch (error) {
    // if error in sending details of products in cart
    productLog.error('error in /products/cart route ', error);
    console.log('error in /products/cart route ', error);
    return res.json({
      type: "error",
      status: 500,
      message: 'server error on /products/cart route'
    });
  }
};
// export function
module.exports = {
  addAndUpdateCart,
  deleteCart,
  showCartproducts,
};