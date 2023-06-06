var express = require('express');
var router = express.Router();
const favoriteProductModel = require('../models/favoriteProducts')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

// for e.g /favorite-products
router.get('/', async function (req, res, next) {
    try {
        console.log("Login user => => ", req.user);
        let products = await favoriteProductModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    let: { "productId": "$_product" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$productId"]
                                }
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
});

// for e.g /favorite-products/add
router.post('/add', async function (req, res, next) {
    try {
        console.log("Login user => => ", req.user);
        let { _product } = req.body
        console.log(`favorite product =========> user:${req.user._id} product: ${_product}`);
        await favoriteProductModel.create({
            _product: new ObjectId(_product),
            _user: new ObjectId(req.user._id),
        })
        return res.json({
            type: "success",
            status: 200,
            message: `product with _id:${_product} added to favorite`
        })
    }
    catch (error) {
        console.log('Error in /favorite-products/add route ', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Server error on /favorite-products/add route'
        })
    }
});

// for e.g /favorite-products/remove
router.delete('/remove', async function (req, res, next) {
    try {
        console.log("Login user => => ", req.user);
        let { _product } = req.body
        console.log(`favorite product =========> user:${req.user._id} product: ${_product}`);
        await favoriteProductModel.deleteOne({
            _user: req.user._id, _product: _product
        })
        return res.json({
            type: "success",
            status: 200,
            message: `product with _id:${_product} removed from favorite`
        })
    }
    catch (error) {
        console.log('Error in /favorite-products/remove route ', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Server error on /favorite-products/remove route'
        })
    }
});
module.exports = router;
