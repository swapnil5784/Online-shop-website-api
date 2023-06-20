module.exports = function (mongoose) {

    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const review = new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        productId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        review: {
            type: String,
            required: true
        }


    }, options)

    return review;
}