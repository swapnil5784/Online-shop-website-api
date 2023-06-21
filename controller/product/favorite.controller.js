// packages
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// common functions
const CommonFunctions = require('../../common/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

// import models
const favoriteProductModel = require('../../models/favoriteProducts')

// services
const productService = require('../../service/product.service')

// To make product favorite as productId in parameter and get list of favorite products
const favoriteProducts = async function (req, res, next) {
  try {
    let { productId } = req.params
    // if productId found in parameter
    if (productId) {
      // if format of productId is not valid
      if (!ObjectId.isValid(productId)) {
        return res.json({
          type: "error",
          status: 409,
          message: "ObjectId is not valid !"
        })
      }
      //query to check is product in favorite collection
      let markedFavoriteAlready = await productService.isFavoriteProduct(productId, req.user._id)
      // if product is already in favorite products collection
      if (markedFavoriteAlready) {
        return res.json({
          type: "eror",
          status: 409,
          message: "Product already in favorite !"
        })
      }
      // mark product favorite and store into collection
      await productService.markProductFavorite(productId, req.user._id)
      return res.json({
        type: "success",
        status: 200,
        favoriteProducts: await db.models.favoriteProducts.countDocuments({ userId: new ObjectId(req.user._id.toString()) }),
        message: "Product successfully added to favorite !"
      })
    }
    // query to store favorite products of logged-in user
    let products = await productService.getFavoriteProductsDetails(req.user._id)
    let favoriteProductsCount = await productService.getFavoriteProductsCount(req.user._id)

    // if user has no favorite products
    if (!products?.length) {
      return res.json({
        type: "error",
        status: 404,
        message: "No favorite products found",
        data: {
          products: products
        }
      })
    }
    return res.json({
      type: "success",
      status: 200,
      data: {
        totalProducts: favoriteProductsCount,
        products: products
      }
    })
  }
  catch (error) {
    // if error while mark product favorite or get list of favorite products
    console.log('Error in /favorite-products route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /favorite-products route'
    })
  }
}

// To remove product from favorite collection
const deleteFavorite = async function (req, res, next) {
  try {
    let { productId } = req.params
    // if productId is not valid
    if (!ObjectId.isValid(productId)) {
      return res.json({
        type: "error",
        status: 409,
        message: "ObjectId is not valid !"
      })
    }
    // query to remove favorite product
    await productService.removeProductFromFavorite(productId, req.user._id)
    return res.json({
      type: "success",
      status: 200,
      message: "Product successfully removed from favorite !"
    })
  }
  catch (error) {
    // error while removing product from favorite collection
    console.log('error at delete: products/favorite/<productId> ', error)
    return res.json({
      type: "error",
      status: 500,
      message: "Server at delete: products/favorite/<productId> !"
    })
  }
}
// exports
module.exports = {
  favoriteProducts,
  deleteFavorite
}