var express = require('express');
var router = express.Router();
var moment = require('moment')
const orderModel = require('../models/orders')
const orderDetailModel = require('../models/orderDetails')
const cartModel = require('../models/carts')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


// functions from controller
const { showOrderDetails } = require('../controller/order/showDetails')
/* GET users listing. */

// for e.g GET : /orders
router.get('/', showOrderDetails);

// for e.g POST : /orders
router.post('/', async function (req, res, next) {
    try {
        let isCartEmpty = await cartModel.countDocuments({ userId: req.user._id })
        if (!isCartEmpty) {
            return res.status(409).json({
                type: "error",
                status: 409,
                message: "Cart is empty cant do order!"
            })
        }
        let { billingId, deliveryId, totalAmount, shippingAmount, paymentMethod } = req.body
        let orderObject = {
            billingId: new ObjectId(billingId),
            deliveryId: new ObjectId(deliveryId),
            userId: new ObjectId(req.user._id),
            totalAmount: totalAmount,
            shippingAmount: shippingAmount,
            paymentMethod: paymentMethod
        }
        // console.log("orderObject = =  > >", orderObject);
        await orderModel.create(orderObject)
        return res.status(200).json({
            type: "success",
            status: 200,
            message: 'Order successfully placed !'
        })
    }
    catch (error) {
        console.log("error at POST : /order", error)
        return res.status(500).json({
            type: "error",
            status: 500,
            message: "Server error at POST : /order !"
        })
    }
});

module.exports = router;
