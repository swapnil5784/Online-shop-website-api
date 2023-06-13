
const CommonFunctions = require('../../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//models
var productModel = require("../../models/products");
const cartModel = require('../../models/carts')


const addAndUpdateCart = async function (req, res, next) {
    try {
        console.log('in --------------------- addAndUpdateCart')
      let { productId, quantity, isAddedFromShop } = req.body
      console.log("productId = = > >", productId)
      let isProductExists = await productModel.countDocuments({ _id: productId })
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
      if (isAddedFromShop) {
        condition['$inc'] = {
          quantity: 1
        }
      } else {
        condition['$set'] = {
          quantity: quantity
        }
      }
  
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
      productLog.error('Error in /products/cart route ', error)
      console.log('Error in /products/cart route ', error)
      return res.json({
        type: "error",
        status: 500,
        message: 'Server error on /products/cart route'
      })
    }
  }


  const deleteCart =  async function (req, res, next) {
    try {
      let { cartId } = req.params
      productLog.info("Route : DELETE = products/review In:routes/product.js  ", "cartId => => ", cartId);
      if (!cartId) {
        return res.json({
          type: "error",
          status: 404,
          message: "CartId not found !"
        })
      }
      if (!ObjectId.isValid(cartId)) {
        return res.json({
          type: "error",
          status: 409,
          message: "CartIs not valid !"
        })
      }
      let cartFoundForDelete = await cartModel.countDocuments({ _id: cartId })
      if (!cartFoundForDelete) {
        return res.json({
          type: "error",
          status: 409,
          message: "Cart not found !"
        })
      }
      console.log("cartId", cartId);
      await cartModel.deleteOne({ _id: cartId })
      return res.json({
        type: "success",
        status: 200,
        message: "Successfully removed from cart."
      })
    }
    catch (error) {
      productLog.error('Error in /cart route ', error)
      console.log('Error in /cart route ', error)
      return res.json({
        type: "error",
        status: 500,
        message: 'Server error on /cart route'
      })
    }
  }

  const showCartproducts = async function (req, res, next) {
    try {
      productLog.info("Route : GET = products/review In:routes/product.js ", "req.user._id = = > ", req.user._id)
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
      productLog.error('error in /products/cart route ', error)
      console.log('error in /products/cart route ', error)
      return res.json({
        type: "error",
        status: 500,
        message: 'server error on /products/cart route'
      })
    }
  }

  module.exports ={
    addAndUpdateCart,
    deleteCart,
    showCartproducts
  }