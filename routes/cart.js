var express = require('express');
var router = express.Router();
const cartModel = require('../models/carts')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

// for e.g /cart 
router.get('/', async function (req, res, next) {
    try {
        let products = await cartModel.aggregate([
            {
                $match : { 
                    _user:user._id
                 }
            },
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
                        },
                        {
                            $project: {
                                title: 1,
                                price: 1,
                                image:1
                            }
                        }
                    ],
                    as: "product"
                }
            },
            {
                $project: {

                    product: { $arrayElemAt: ["$product", 0] },
                    quantity: 1,
                    total: { $multiply: ["$quantity", { $arrayElemAt: ["$product.price", 0] }] }
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
        console.log('error in /cart route ', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'server error on /cart route'
        })
    }
});

// for e.g /cart/add-products
router.post('/add-product', async function (req, res, next) {
    try {
        console.log("Login user => => ", user);
        let { _product, quantity } = req.body
        console.log(`user:${user._id} product: ${_product} quantity: ${quantity}`);
        let productAlreadyInCart = await cartModel.findOne({$and:[ {_product:_product} , {_user:user._id} ]})
        if(!productAlreadyInCart){
            let productToAdd = {
                _product: new ObjectId(_product),
                _user: new ObjectId(user._id),
                quantity: quantity
            }
            await cartModel.create(productToAdd)
            return res.json({
                type: "success",
                status: 200,
                message: `product with _id:${_product} added to cart with quantity:${quantity}`
            })
        }
        await cartModel.updateOne({_product:_product,_user:user._id},{ $set :{ quantity : productAlreadyInCart.quantity+
        quantity } })
        return res.json({
            type: "success",
            status: 200,
            message: `product with _id:${_product} added to cart with quantity:${quantity}`
        })
        
    }
    catch (error) {
        console.log('Error in /cart route ', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Server error on /cart route'
        })
    }
});

// for e.g /cart/remove-product
router.delete('/remove-product', async function (req, res, next) {
    try {
        console.log("Login user => => ", user);
        let { _product } = req.body;
        console.log("_product",_product);
        await cartModel.deleteMany({ _user: user._id, _product: _product })
        return res.json({
            type: "success",
            status: 200,
            message: "Successfully removed from cart."
        })
    }
    catch (error) {
        console.log('Error in /cart route ', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Server error on /cart route'
        })
    }
});
module.exports = router;
