
module.exports = function (mongoose) {

    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const category = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        categoryProducts: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        }

    }, options)
    return category;
}