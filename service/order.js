// import models
const orderDetailModel = require('../models/orderDetails')
const orderModel = require('../models/orders')



const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const getUserOrderDetails = async function (userId) {
    // ------------- empty function------
    return new Promise(async function (resolve, reject) {
        try {
            let details = await orderDetailModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId)
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
                        as: 'products.product'
                    }
                },
                {
                    $unwind: {
                        path: '$products.product'
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
                        user: 1,
                        // billingAddress: 1,
                        billingAddress: { $arrayElemAt: ["$billingAddress", 0] },
                        deliveryAddress: { $arrayElemAt: ["$deliveryAddress", 0] },
                        createdOn: 1,
                        orderDetails: 1,
                        paymentMethod: "$orderDetails.paymentMethod",

                    }
                },
                {
                    $sort: {
                        createdOn: -1
                    }
                }

            ])
            resolve(details)
        }
        catch (error) {
            console.log('error in order service for show order Details = = > > ', error)
            reject(error)
        }
    })
}

module.exports = {
    getUserOrderDetails
}