
const CommonFunctions = require('../../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// import models
const favoriteProductModel = require('../../models/favoriteProducts')


const markFavoriteAndGetFavorite =  async function (req, res, next) {
    try {
      // console.log("Login user => => ", req.user);
      let { productId } = req.params
      if (productId) {
        if (!ObjectId.isValid(productId)) {
          return res.json({
            type: "error",
            status: 409,
            message: "ObjectId is not valid !"
          })
        }
        let markedFavoriteAlready = await favoriteProductModel.countDocuments({
          productId: new ObjectId(productId),
          userId: new ObjectId(req.user._id),
        })
        if (markedFavoriteAlready) {
          return res.json({
            type: "eror",
            status: 409,
            message: "Product already in favorite !"
          })
        }
        await favoriteProductModel.create({
          productId: new ObjectId(productId),
          userId: new ObjectId(req.user._id),
        })
        return res.json({
          type: "success",
          status: 200,
          message: "Product successfully added to favorite !"
        })
      }
      let products = await favoriteProductModel.aggregate([
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
                  _id: 1,
                  title: 1,
                  price: 1,
                  category: 1,
                  rating: 1,
                  color: 1,
                  size: 1,
                  description: 1,
                  image: 1
                }
              }
            ],
            as: "product"
          }
        },
        {
          $project: {
            product: { $arrayElemAt: ["$product", 0] },
          }
        }
      ])
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
          products: products
        }
      })
    }
    catch (error) {
      console.log('Error in /favorite-products route ', error)
      return res.json({
        type: "error",
        status: 500,
        message: 'Server error on /favorite-products route'
      })
    }
  }

  const deleteFavorite = async function (req, res, next) {
    try {
      let { productId } = req.params
      if (!ObjectId.isValid(productId)) {
        return res.json({
          type: "error",
          status: 409,
          message: "ObjectId is not valid !"
        })
      }
      let documentToDeleteFound = await favoriteProductModel.countDocuments({ productId: productId, userId: req.user._id })
      if (!documentToDeleteFound) {
        return res.json({
          type: "error",
          status: 404,
          message: "Product not found !"
        })
      }
      await favoriteProductModel.deleteOne({ productId: productId, userId: req.user._id })
      return res.json({
        type: "success",
        status: 200,
        message: "Product successfully removed from favorite !"
      })
    }
    catch (error) {
      console.log('error at delete: products/favorite/<productId> ', error)
      return res.json({
        type: "error",
        status: 500,
        message: "Server at delete: products/favorite/<productId> !"
      })
    }
  }

  module.exports = {
    markFavoriteAndGetFavorite,
    deleteFavorite
  }