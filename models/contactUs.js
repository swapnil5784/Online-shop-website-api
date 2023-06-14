const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const options = {
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
}
// model schema
const contactUs = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },

}, options)

// model export
const contacus = mongoose.model('contactUs', contactUs);
module.exports = contacus;