
module.exports = function (mongoose) {
    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const vendor = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }

    }, options)
    return vendor
}
