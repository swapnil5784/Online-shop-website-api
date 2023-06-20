
module.exports = function (mongoose) {


    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const advertisement = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        btnName: {
            type: String,
            required: true
        }

    }, options)
    return advertisement
}
