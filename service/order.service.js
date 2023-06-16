// packages
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// models
const orderDetailModel = require('../models/orderDetails')
const orderModel = require('../models/orders')

// To send orderDetails of specific order by orderId
const SpecificOrderInDetail = async (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // query to get a order and its details
            let details = await orderDetailModel.findOne(
                {
                    _id: new ObjectId(orderId)
                }
            )
            console.log('details = = > >', details)
            resolve(details)
        } catch (error) {
            // if error while sending orderDetails
            console.log("error in fetching specific order details !", error)
            reject(error)
        }
    })
}

// To send the list of orders of logged in user 
const getUserOrderDetails = async function (userId) {
    // ------------- empty function------
    return new Promise(async function (resolve, reject) {
        try {
            let orderListDetails = await orderDetailModel.find(
                {
                    userId: new ObjectId(userId)
                },
                {
                    createdOn: 1,
                    orderAmount: { $sum: ["$totalAmount", "$shippingAmount"] },
                    paymentMethod: 1
                }

            )
            resolve(orderListDetails)
        }
        catch (error) {
            // if error in sending order List
            console.log('error in order service for show order Details = = > > ', error)
            reject(error)
        }
    })
}

// exports
module.exports = {
    getUserOrderDetails,
    SpecificOrderInDetail
}