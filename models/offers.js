// import 
module.exports = function (mongoose) {


    const options = {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    }
    // model schema
    const offer = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        type: {
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
    return offer;
}