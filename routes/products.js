var express = require("express");
var router = express.Router();
var productModel = require("../models/products");
var categoryModel = require("../models/categories");
var reviewModel = require('../models/reviews')
const cartModel = require('../models/carts')
const favoriteProductModel = require('../models/favoriteProducts')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var { authentication } = require('../comman/middlewares')
const favoriteProducts = require("../models/favoriteProducts");
const CommonFunctions = require('../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

// import controllers
const { addReview , deleteReview } = require('../controller/product/review.controller.js')
const { addAndUpdateCart , deleteCart ,showCartproducts} = require('../controller/product/cart.controller.js')
const { markFavoriteAndGetFavorite , deleteFavorite } = require('../controller/product/favorite.controller.js')
const { getProductFilter } = require('../controller/product/filter.controller.js')
const { getProducts } = require('../controller/product/products.controller.js') 

// for e.g /products/review
router.post('/review', authentication, addReview)

// for e.g /products/review/remove/<reviewId>
router.delete('/review/remove/:reviewId', authentication, deleteReview)

// for e.g POST: /products/cart
router.post('/cart', authentication, addAndUpdateCart)

//for e.g GET : /products/cart
router.get('/cart', authentication,showCartproducts);

// for e.g DELETE : /products/cart/remove
router.delete('/cart/remove/:cartId', authentication,deleteCart);

// for e.g GET : /products/favorite  & GET : /products/favorite/646f3bac5d3d7c99439ec906
router.get('/favorite/:productId?', authentication, markFavoriteAndGetFavorite);

// for DELETE : /products/favorite/remove/646f3bac5d3d7c99439ec906
router.delete('/favorite/remove/:productId', authentication, deleteFavorite)

// for e.g /products/filters
router.get("/filters", getProductFilter);

// for e.g POST : /products
router.post("/:id?",getProducts);



module.exports = router;

