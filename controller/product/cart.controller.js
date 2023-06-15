// packages
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// comman function
const CommonFunctions = require('../../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

//models
var productModel = require("../../models/products");
const cartModel = require('../../models/carts')

// To add and update cart as details passed in body
const addAndUpdateCart = async function (req, res, next) {
  try {
    let { productId, quantity, isAddedFromShop } = req.body
    console.log("productId = = > >", productId)
    // query to check if product is exist in product collection with mentioned productId
    let isProductExists = await productModel.countDocuments({ _id: productId })
    // if product not exist
    if (!isProductExists) {
      return res.json({
        type: "error",
        status: 404,
        message: "Product not found !"
      })
    }
    let productToAdd = {
      productId: new ObjectId(productId),
      userId: new ObjectId(req.user._id),
      quantity: quantity
    }
    let condition = {};
    // if product added from shop increment to product available in cart
    if (isAddedFromShop) {
      condition['$inc'] = {
        quantity: 1
      }
    } else {
      // else set number of product passed from checkout page of details page
      condition['$set'] = {
        quantity: quantity
      }
    }

    // used upsert if product is already in cart update else create a document
    const updateCheck = await cartModel.updateOne(
      {
        productId: new ObjectId(productId),
        userId: new ObjectId(req.user._id),
      },
      condition,
      {
        upsert: true
      }
    )

    // console.log("updateCheck", updateCheck);
    return res.json({
      type: "success",
      status: 200,
      message: `Product added to cart successfully`
    })
  }
  catch (error) {
    // if error in add to cart process
    productLog.error('Error in /products/cart route ', error)
    console.log('Error in /products/cart route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /products/cart route'
    })
  }
}

// To remove product from cart with any number of quantity
const deleteCart = async function (req, res, next) {
  try {
    let { cartId } = req.params
    productLog.info("Route : DELETE = products/review In:routes/product.js  ", "cartId => => ", cartId);
    // if cartId not found in params
    if (!cartId) {
      return res.json({
        type: "error",
        status: 404,
        message: "CartId not found !"
      })
    }
    // cartId is not in ObjectId format
    if (!ObjectId.isValid(cartId)) {
      return res.json({
        type: "error",
        status: 409,
        message: "CartIs not valid !"
      })
    }
    // query to get count if mentioned product is in cart ot not
    let cartFoundForDelete = await cartModel.countDocuments({ _id: cartId })
    // if product to delete is not in cart
    if (!cartFoundForDelete) {
      return res.json({
        type: "error",
        status: 409,
        message: "Cart not found !"
      })
    }
    console.log("cartId", cartId);
    // query to remove product from cart
    await cartModel.deleteOne({ _id: cartId })
    return res.json({
      type: "success",
      status: 200,
      message: "Successfully removed from cart."
    })
  }
  catch (error) {
    // if error in process of removing product from cart
    productLog.error('Error in /cart route ', error)
    console.log('Error in /cart route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /cart route'
    })
  }
}

// To send list of products in cart
const showCartproducts = async function (req, res, next) {
  try {
    productLog.info("Route : GET = products/review In:routes/product.js ", "req.user._id = = > ", req.user._id)
    // query to get products in cart
    let products = await cartModel.aggregate([
      {
        $match: {
          userId: req.user._id
        }
      },
      {
        $lookup: {
          from: "products",
          let: { "productId": "$productId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$productId"]
                }
              }
            },
            {
              $project: {
                productId: "$_id",
                _id: 0,
                title: 1,
                price: 1,
                image: 1
              }
            }
          ],
          as: "product"
        }
      },
      {
        $project: {
          cartId: "$_id",
          _id: 0,
          product: { $arrayElemAt: ["$product", 0] },
          quantity: 1,
          total: { $multiply: ["$quantity", { $arrayElemAt: ["$product.price", 0] }] }
        }
      }
    ])
    // console.log("products = =>>", products)
    // if no products in cart
    if (!products?.length) {
      return res.json({
        type: "error",
        status: 404,
        message: "No products in cart!",
        data: {
          totalProductsInCart: products.length,
          products: products
        }
      })
    }
    return res.json({
      type: "success",
      status: 200,
      data: {
        totalProductsInCart: products.length,
        products: products
      }
    })
  }
  catch (error) {
    // if error in sending details of products in cart
    productLog.error('error in /products/cart route ', error)
    console.log('error in /products/cart route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'server error on /products/cart route'
    })
  }
}
// export function
module.exports = {
  addAndUpdateCart,
  deleteCart,
  showCartproducts
}