
module.exports = function (mongoose) {
    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const cart = new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        productId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }


    }, options)
    return cart;
}
