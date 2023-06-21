// packages
const express = require("express");
const router = express.Router();

// middlewares
const { authentication } = require('../common/middlewares')

// controllers
const { addReview, deleteReview } = require('../controller/product/review.controller.js')
const { addAndUpdateCart, deleteCart, showCartproducts } = require('../controller/product/cart.controller.js')
const { favoriteProducts, deleteFavorite } = require('../controller/product/favorite.controller.js')
const { getProductFilter } = require('../controller/product/filter.controller.js')
const { getProducts } = require('../controller/product/products.controller.js')

// For get review details and assign to the mentioned product
router.post('/review', authentication, validation("add-review"), addReview)

// For remove review
router.delete('/review/remove/:reviewId', authentication, deleteReview)

// For get cart details and store to db 
router.post('/cart', authentication, addAndUpdateCart)

// For sending cart details
router.get('/cart', authentication, showCartproducts);

// For delete product in cart
router.delete('/cart/remove/:cartId', authentication, deleteCart);

// For get favorite products and mark product favorite
router.get('/favorite/:productId?', authentication, favoriteProducts);

// For remove product from favorite
router.delete('/favorite/remove/:productId', authentication, deleteFavorite)

// For sending product's filters
router.get("/filters", getProductFilter);

// For get details and accoroding to that send products ( filters )
router.post("/:id?", getProducts);



module.exports = router;

