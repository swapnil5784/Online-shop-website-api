var express = require('express');
var router = express.Router();
const favoriteProductModel = require('../models/favoriteProducts')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

// for e.g /favorite-products


// for e.g /favorite-products/add
// router.post('/add', async function (req, res, next) {
//     try {
//         console.log("Login user => => ", req.user);
//         let { productId } = req.body
//         console.log(`favorite product =========> user:${req.user._id} product: ${productId}`);
//         await favoriteProductModel.create({
//             productId: new ObjectId(productId),
//             userId: new ObjectId(req.user._id),
//         })
//         return res.json({
//             type: "success",
//             status: 200,
//             message: `product with _id:${productId} added to favorite`
//         })
//     }
//     catch (error) {
//         console.log('Error in /favorite-products/add route ', error)
//         return res.json({
//             type: "error",
//             status: 500,
//             message: 'Server error on /favorite-products/add route'
//         })
//     }
// });

// for e.g /favorite-products/remove
// router.delete('/remove', async function (req, res, next) {
//     try {
//         console.log("Login user => => ", req.user);
//         let { productId } = req.body
//         console.log(`favorite product =========> user:${req.user._id} product: ${productId}`);
//         await favoriteProductModel.deleteOne({
//             userId: req.user._id, productId: productId
//         })
//         return res.json({
//             type: "success",
//             status: 200,
//             message: `product with _id:${productId} removed from favorite`
//         })
//     }
//     catch (error) {
//         console.log('Error in /favorite-products/remove route ', error)
//         return res.json({
//             type: "error",
//             status: 500,
//             message: 'Server error on /favorite-products/remove route'
//         })
//     }
// });
module.exports = router;
