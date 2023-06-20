module.exports = function (mongoose) {
    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const subscriber = new mongoose.Schema({
        userEmail: {
            type: String,
            required: true
        }

    }, options)
    return subscriber;
}
