
module.exports = function (mongoose) {
    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const user = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
        },
        mobile: {
            type: String,
            required: true
        },
        timezone: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        resetOtp: {
            type: String
        },
        otpExpiredAt: {
            type: String
        }

    }, options)
    return user
}
