//packages
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

//services
const orderService = require('../../service/order.service')

// To show order details  logged user made
const showOrderDetails = async function (req, res, next) {
    try {
        let { orderId } = req.params
        if (orderId) {
            if (!ObjectId.isValid(orderId)) {
                return res.json({
                    type: "error",
                    status: 500,
                    message: "ObjectId of order is not valid !"
                })
            }
            let orderDetail = await orderService.SpecificOrderInDetail(orderId)
            return res.json({
                type: "success",
                status: 200,
                message: `Details of a order with orderDetailsId: ${orderId} .`,
                data: {
                    orderDetail: orderDetail
                }
            })
        }
        // query to get orderdetails of all orders of logged in user
        let orderDetails = await orderService.getUserOrderDetails(req.user._id)
        // if logged-in user has no order
        if (!orderDetails.length) {
            return res.json({
                type: "error",
                status: 404,
                message: "No orderDetails found !",
                data: orderDetails
            })
        }
        return res.json({
            type: "success",
            status: 200,
            message: "User's order details.",
            data: {
                orders: orderDetails
            }

        })
    }
    catch (error) {
        // if error in sending order details
        console.log("error at /order", error)
        return res.json({
            type: "error",
            status: 500,
            message: "Server error at /orders !"
        })
    }
}

// export function
module.exports = {
    showOrderDetails
}