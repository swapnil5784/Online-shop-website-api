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
                        userId: userId
                    }
                }
                ,
                {
                    $unwind: {
                        path: "$products"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: { "pid": "$products.productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$pid"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    title: 1,
                                    price: 1,
                                    description: 1,
                                    category: 1,
                                    rating: 1,
                                    color: 1,
                                    size: 1,
                                    _id: 0
                                }
                            }
                        ],
                        as: "productDetails"
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
                            }, {
                                $project: {
                                    billingId: 1,
                                    deliveryId: 1,
                                    totalAmount: 1,
                                    shippingAmount: 1,
                                    paymentMethod: 1,
                                    createdOn: 1,
                                    _id: 0
                                }
                            }

                        ],
                        as: "orderDetails"
                    }
                },
                {
                    $project: {
                        productQuantity: "$products.quantity",
                        productDetails: { $arrayElemAt: ["$productDetails", 0] },
                        orderAmount: 1,
                        orderDetails: { $arrayElemAt: ["$orderDetails", 0] },
                    }
                },
                {
                    $lookup: {
                        from: "addressbooks",
                        let: { "aid": "$orderDetails.billingId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$aid"]
                                    }
                                }
                            }, {

                                $project: {
                                    title: 1,
                                    country: 1,
                                    name: 1,
                                    mobileNo: 1,
                                    pincode: 1,
                                    addressLineOne: 1,
                                    addressLineTwo: 1,
                                    landmark: 1,
                                    city: 1,
                                    state: 1
                                }
                            }

                        ],
                        as: "billingAddress"
                    }
                },
                {
                    $lookup: {
                        from: "addressbooks",
                        let: { "aid": "$orderDetails.deliveryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$aid"]
                                    }
                                }
                            },
                            {

                                $project: {
                                    title: 1,
                                    country: 1,
                                    name: 1,
                                    mobileNo: 1,
                                    pincode: 1,
                                    addressLineOne: 1,
                                    addressLineTwo: 1,
                                    landmark: 1,
                                    city: 1,
                                    state: 1
                                }
                            }

                        ],
                        as: "deliveryAddress"
                    }
                },
                {
                    $project: {
                        orderAmount: 1,
                        productQuantity: 1,
                        productDetails: 1,
                        orderDetails: 1,
                        billingAddress: { $arrayElemAt: ["$billingAddress", 0] },
                        deliveryAddress: { $arrayElemAt: ["$deliveryAddress", 0] }

                    }
                }
            ])
            // let products = []
            // details.forEach(orderDetails => {
            //     products.push({
            //         quantity: orderDetails.productQuantity,
            //         product: orderDetails.productDetails
            //     })
            // });
            // let formattedDetails = {
            //     order: {
            //         billingAddress: details[0].billingAddress,
            //         deliveryAddress: details[0].deliveryAddress,
            //         totalAmount: details[0].orderDetails.totalAmount,
            //         shippingAmount: details[0].orderDetails.shippingAmount,
            //         paymentMethod: details[0].orderDetails.paymentMethod,
            //         createdOn: details[0].orderDetails.createdOn,
            //         products: products
            //     },
            // }
            // let orders = []
            // details.forEach(order => {
            //     orders.push(JSON.stringify(formattedDetails, null, 3))
            // });
            // console.log("= =  > >", orders)
            resolve(details)
            // resolve(formattedDetails)
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