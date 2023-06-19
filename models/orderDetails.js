const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const options = {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn',
    }
}

const productDetails = {
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    rating: {
        rate: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }
}

const productItem = {
    productId: {
        type: ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    productDetails: productDetails
}

const userSchema = {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    }
}

const addressSchema = {
    title: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    addressLineOne: {
        type: String,
        required: true
    },
    addressLineTwo: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
}

const orderDetail = mongoose.Schema({
    products: [productItem],
    userId: {
        type: ObjectId,
        required: true
    },
    totalAmount: {
        type: Number,
        require: true
    },
    shippingAmount: {
        type: Number,
        require: true
    },
    paymentMethod: {
        type: String,
        require: true
    },
    billingAddress: addressSchema,
    deliveryAddress: addressSchema,
    status: {
        type: String,
        enum: ["Success", "Pending", "Failed"],
        required: true
    }
}, options)

const orderDetails = mongoose.model('orderDetails', orderDetail)
module.exports = orderDetails;