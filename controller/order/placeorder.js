const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// import models
const cartModel = require('../../models/carts.js')
const orderModel = require('../../models/orders.js')

module.exports ={
    placeOrder:async function (req, res, next) {
        try {
            let isCartEmpty = await cartModel.countDocuments({ userId: req.user._id })
            if (!isCartEmpty) {
                return res.json({
                    type: "error",
                    status: 409,
                    message: "Cart is empty cant do order!"
                })
            }
            let { shipToDifferentAddress, billingId, deliveryId, totalAmount, shippingAmount, paymentMethod } = req.body
            let orderObject = {
                billingId: new ObjectId(billingId),
                deliveryId: new ObjectId(billingId),
                userId: new ObjectId(req.user._id),
                totalAmount: totalAmount,
                shippingAmount: shippingAmount,
                paymentMethod: paymentMethod
            }
            if (shipToDifferentAddress) {
                orderObject.deliveryId = new ObjectId(deliveryId)
            }
            // console.log("orderObject = =  > >", orderObject);
            await orderModel.create(orderObject)
            return res.json({
                type: "success",
                status: 200,
                message: 'Order successfully placed !'
            })
        }
        catch (error) {
            console.log("error at POST : /order", error)
            return res.json({
                type: "error",
                status: 500,
                message: "Server error at POST : /order !"
            })
        }
    }
}