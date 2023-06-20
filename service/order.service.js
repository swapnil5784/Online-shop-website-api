// packages
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// To send orderDetails of specific order by orderId
const SpecificOrderInDetail = async (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // query to get a order and its details
            let details = await db.models.orderDetails.findOne(
                {
                    _id: new ObjectId(orderId)
                }
            ).lean()
            // console.log('details = = > >', details)
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
            let orderListDetails = await db.models.orderDetails.find(
                {
                    userId: new ObjectId(userId)
                },
                {
                    createdOn: 1,
                    orderAmount: { $sum: ["$totalAmount", "$shippingAmount"] },
                    paymentMethod: 1,
                    status: 1
                }
            ).sort({ createdOn: -1 })
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