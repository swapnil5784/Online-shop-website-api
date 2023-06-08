// import 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const orderDetailModel = require('../models/orderDetails')
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
        const productsInOrder = await cartModel.find({ userId: _this.userId.toString() }, { productId: 1, quantity: 1, _id: 0 })
        let detailsOfOrder = {
            orderId: new ObjectId(_this._id),
            price: _this.totalAmount + _this.shippingAmount,
            products: productsInOrder
        }
        await orderDetailModel.create(detailsOfOrder)
        await cartModel.deleteMany({ userId: _this.userId.toString() })
    }
    catch (error) {
        console.log("error at post hook in order model ", error)
    }
})

// model export
const orders = mongoose.model('orders', order);
module.exports = orders;