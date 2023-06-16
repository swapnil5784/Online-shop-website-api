// import 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const orderDetailModel = require('../models/orderDetails')
const addressBookModel = require('../models/addressBook')
const cartModel = require('../models/carts')
const options = {
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
}
// model schema
const order = new mongoose.Schema({
    billingId: {
        type: ObjectId,
        required: true,
        ref: "adddressModel"
    },
    deliveryId: {
        type: ObjectId,
        required: true,
        ref: "adddressModel"
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "userModel"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true
    }
}, options)


// post hook
order.post('save', async function () {
    try {
        // console.log("this = = > >", this)
        const _this = this
        // const check = await cartModel.find({ userId: _this.userId.toString() }, { productId: 1, quantity: 1, _id: 0 })
        const productsInOrder = await cartModel.aggregate([
            {
                $match: {
                    userId: new ObjectId(_this.userId.toString())
                }
            },
            {
                $lookup: {
                    from: "products",
                    let: { "id": "$productId" },
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
                                price: 1,

                            }
                        }
                    ],
                    as: "price"
                }
            },
            {
                $project: {
                    productId: 1,
                    productPrice: { $arrayElemAt: ["$price.price", 0] },
                    quantity: 1,
                    _id: 0
                }
            }])
        // console.log('productsInOrder = => ', productsInOrder, "check = =  > >", check)
        let detailsOfOrder = {
            orderId: new ObjectId(_this._id),
            userId: new ObjectId(_this.userId.toString()),
            orderAmount: _this.totalAmount + _this.shippingAmount,
            products: productsInOrder
        }
        console.log("_this = = > > ", _this)
        let productsInCart = await cartModel.aggregate([
            {
                $match: {
                    userId: new ObjectId(_this.userId.toString())
                }
            },
            {
                $lookup: {
                    from: "products",
                    let: { "pId": "$productId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$pId"]
                                }
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                price: 1,
                                description: 1,
                                image: 1,
                                rating: 1,
                                color: 1,
                                size: 1,
                                category: 1,
                                _id: 0,
                            }
                        }
                    ],
                    as: "productDetails"
                }
            },
            {
                $project: {
                    productId: 1,
                    quantity: 1,
                    productDetails: { $arrayElemAt: ["$productDetails", 0] },
                    _id: 0
                }
            }
        ])

        let billingAddress = await addressBookModel.findOne(
            {
                _id: new ObjectId(_this.billingId.toString())
            }
            ,
            {
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
                _id: 0
            }
        )

        let deliveryAddress = await addressBookModel.findOne(
            {
                _id: new ObjectId(_this.deliveryId.toString())
            }
            ,
            {
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
                _id: 0
            }
        )
        let fixedOrder = {
            products: productsInCart,
            // createdOn:,
            userId: _this.userId.toString(),
            totalAmount: _this.totalAmount,
            shippingAmount: _this.shippingAmount,
            paymentMethod: _this.paymentMethod,
            billingAddress: billingAddress,
            deliveryAddress: deliveryAddress,
        }
        console.log("fixedOrder = = > >", JSON.stringify(fixedOrder, null, 3))
        await orderDetailModel.create(fixedOrder)
        await cartModel.deleteMany({ userId: _this.userId.toString() })
    }
    catch (error) {
        console.log("error at post hook in order model ", error)
    }
})

// model export
const orders = mongoose.model('orders', order);
module.exports = orders;