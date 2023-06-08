var express = require('express');
var router = express.Router();
var moment = require('moment')
const orderModel = require('../models/orders')
const orderDetailModel = require('../models/orderDetails')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
/* GET users listing. */

// for e.g GET : /orders
router.get('/', async function (req, res, next) {
    try {
        let orders = await orderModel.find({ userId: req.user._id }, { _id: 0, orderId: "$_id", userId: 1, billingId: 1, deliveryId: 1, totalAmount: 1, shippingAmount: 1, paymentMethod: 1, createdOn: "$createdOn" })

        return res.status(200).json({
            type: "success",
            status: 200,
            message: "User's order details.",
            data: {
                orders: orders
            }
        })
    }
    catch (error) {
        console.log("error at /order", error)
        return res.status(500).json({
            type: "error",
            status: 500,
            message: "Server error at /orders !"
        })
    }
});

// for e.g POST : /orders
router.post('/', async function (req, res, next) {
    try {
        let { billingId, deliveryId, totalAmount, shippingAmount, paymentMethod } = req.body
        let orderObject = {
            billingId: new ObjectId(billingId),
            deliveryId: new ObjectId(deliveryId),
            userId: new ObjectId(req.user._id),
            totalAmount: totalAmount,
            shippingAmount: shippingAmount,
            paymentMethod: paymentMethod
        }
        console.log("orderObject = =  > >", orderObject);
        await orderModel.create(orderObject)
        return res.status(200).json({
            type: "success",
            status: 200,
            message: 'pending POST : /orders'
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
