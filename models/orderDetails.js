// import 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const options = {
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
}
// model schema
const orderDetail = new mongoose.Schema({
    orderId: {
        type: ObjectId,
        required: true,
        ref: "orders"
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "users"
    },
    orderAmount: {
        type: Number,
        required: true
    },
    products: {
        type: Array,
        required: true
    }

}, options)

// model export
const orderDetails = mongoose.model('orderDetails', orderDetail);
module.exports = orderDetails;