

module.exports = function (mongoose) {

    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const order = new mongoose.Schema({
        billingId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "adddressModel"
        },
        deliveryId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "adddressModel"
        },
        userId: {
            type: mongoose.Types.ObjectId,
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
            const productsInOrder = await db.models.carts.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(_this.userId.toString())
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
                orderId: new mongoose.Types.ObjectId(_this._id),
                userId: new mongoose.Types.ObjectId(_this.userId.toString()),
                orderAmount: _this.totalAmount + _this.shippingAmount,
                products: productsInOrder
            }
            // console.log("_this = = > > ", _this)
            let productsInCart = await db.models.carts.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(_this.userId.toString())
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

            let billingAddress = await db.models.addressBook.findOne(
                {
                    _id: new mongoose.Types.ObjectId(_this.billingId.toString())
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
            ).lean()

            let deliveryAddress = await db.models.addressBook.findOne(
                {
                    _id: new mongoose.Types.ObjectId(_this.deliveryId.toString())
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
            ).lean()
            let fixedOrder = {
                products: productsInCart,
                // createdOn:,
                userId: _this.userId.toString(),
                totalAmount: _this.totalAmount,
                shippingAmount: _this.shippingAmount,
                paymentMethod: _this.paymentMethod,
                billingAddress: billingAddress,
                deliveryAddress: deliveryAddress,
                status: "Success"
            }
            // console.log("fixedOrder = = > >", JSON.stringify(fixedOrder, null, 3))
            await db.models.orderDetails.create(fixedOrder)
            await db.models.carts.deleteMany({ userId: _this.userId.toString() })
        }
        catch (error) {
            console.log("error at post hook in order model ", error)
        }
    })
    return order;
}