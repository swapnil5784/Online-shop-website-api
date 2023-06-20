const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


module.exports = function (mongoose) {
    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    const favoriteProduct = new mongoose.Schema({
        userId: {
            type: ObjectId,
            required: true
        },
        productId: {
            type: ObjectId,
            required: true
        },

    }, options)

    return favoriteProduct
}


