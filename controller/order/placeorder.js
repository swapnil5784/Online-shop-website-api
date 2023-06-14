// packages
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// models
const cartModel = require('../../models/carts.js')
const orderModel = require('../../models/orders.js')

module.exports = {
    // function to place order
    placeOrder: async function (req, res, next) {
        try {
            // query to get number of products in cart
            let isCartEmpty = await cartModel.countDocuments({ userId: req.user._id })
            // if cart is empty
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
            // if shipping and delivery addresses are different 
            if (shipToDifferentAddress) {
                orderObject.deliveryId = new ObjectId(deliveryId)
            }
            // query to store order details into db
            await orderModel.create(orderObject)
            return res.json({
                type: "success",
                status: 200,
                message: 'Order successfully placed !'
            })
        }
        catch (error) {
            // if error in place order process
            console.log("error at POST : /order", error)
            return res.json({
                type: "error",
                status: 500,
                message: "Server error at POST : /order !"
            })
        }
    }
}