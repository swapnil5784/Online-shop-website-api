
const orderService = require('../../service/order')

const showOrderDetails = async function (req, res, next) {
    try {
        let orderDetails = await orderService.getUserOrderDetails(req.user._id)
        if (!orderDetails.length) {
            return res.status(404).json({
                type: "error",
                status: 404,
                message: "No orderDetails found !",
                data: orderDetails
            })
        }
        return res.status(200).json({
            type: "success",
            status: 200,
            message: "User's order details.",
            data: orderDetails

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
}

module.exports = {
    showOrderDetails
}