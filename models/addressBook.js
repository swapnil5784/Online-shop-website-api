
module.exports = function (mongoose) {

    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const address = new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
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
        isDefault: {
            type: Boolean,
            required: true,
            default: false
        }

    }, options)
    return address;
}
