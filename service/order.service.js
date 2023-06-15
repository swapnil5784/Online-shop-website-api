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
            let details = await orderDetailModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(orderId)
                    }
                },
                {
                    $unwind: {
                        path: '$products'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        let: { "pId": "$products.productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$pId"]
                                    }
                                }
                            }
                        ],
                        as: 'products.productDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$products.productDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        products: {
                            $push: '$products'
                        },
                        createdOn: { $addToSet: "$createdOn" },
                        orderAmount: { $addToSet: "$orderAmount" },
                        orderId: { $addToSet: "$orderId" },
                        userId: { $addToSet: "$userId" }

                    }
                },
                {
                    $project: {
                        products: 1,
                        createdOn: { $arrayElemAt: ["$createdOn", 0] },
                        orderAmount: { $arrayElemAt: ["$orderAmount", 0] },
                        orderId: { $arrayElemAt: ["$orderId", 0] },
                        userId: { $arrayElemAt: ["$userId", 0] }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { "id": "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {

                                        $eq: ["$_id", "$$id"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    name: 1,
                                    email: 1,
                                    country: 1,
                                    mobile: 1,
                                    profileImage: 1
                                }
                            }
                        ],
                        as: "user"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { "id": "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {

                                        $eq: ["$_id", "$$id"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    name: 1,
                                    email: 1,
                                    country: 1,
                                    mobile: 1,
                                    profileImage: 1
                                }
                            }
                        ],
                        as: "user"
                    }
                },
                {
                    $lookup: {
                        from: "orders",
                        let: { "oid": "$orderId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {

                                        $eq: ["$_id", "$$oid"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    billingId: 1,
                                    deliveryId: 1,
                                    totalAmount: 1,
                                    shippingAmount: 1,
                                    paymentMethod: 1,

                                }
                            }
                        ],
                        as: "orderDetails"
                    }
                },
                {
                    $project: {
                        products: 1,
                        user: { $arrayElemAt: ["$user", 0] },
                        createdOn: 1,
                        user: { $arrayElemAt: ["$user", 0] },
                        orderDetails: 1,
                        orderDetails: { $arrayElemAt: ["$orderDetails", 0] },
                    }
                },
                {
                    $lookup: {
                        from: "addressbooks",
                        let: { "bid": "$orderDetails.billingId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$bid"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    title: 1,
                                    country: 1,
                                    name: 1,
                                    mobileNo: 1,
                                    pincode: 1,
                                    addressLineOne: 1,
                                    addressLineTwo: 1,
                                    landmark: 1,
                                    city: 1,
                                    state: 1,
                                }
                            }

                        ],
                        as: "billingAddress"
                    }
                },

                {
                    $lookup: {
                        from: "addressbooks",
                        let: { "did": "$orderDetails.deliveryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$did"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    title: 1,
                                    country: 1,
                                    name: 1,
                                    mobileNo: 1,
                                    pincode: 1,
                                    addressLineOne: 1,
                                    addressLineTwo: 1,
                                    landmark: 1,
                                    city: 1,
                                    state: 1,
                                }
                            }

                        ],
                        as: "deliveryAddress"
                    }
                },
                {
                    $project: {
                        totalAmount: "$orderDetails.totalAmount",
                        shippingAmount: "$orderDetails.shippingAmount",
                        products: 1,
                        billingAddress: { $arrayElemAt: ["$billingAddress", 0] },
                        deliveryAddress: { $arrayElemAt: ["$deliveryAddress", 0] },
                        createdOn: 1,
                        paymentMethod: 1,
                        user: 1

                    }
                }
            ])
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
            let orderListDetails = await orderDetailModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "orders",
                        let: { "oId": "$orderId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$oId"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    paymentMethod: 1
                                }
                            }
                        ],
                        as: "orderDetails"
                    }
                },
                {
                    $sort: { createdOn: -1 }
                },
                {
                    $project: {
                        createdOn: 1,
                        orderAmount: 1,
                        paymentMethod: { $arrayElemAt: ["$orderDetails.paymentMethod", 0] }
                    }
                }

            ])
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