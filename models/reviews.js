// packages
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// models
const reviewModel = require('../models/reviews')

const options = {
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
}
// model schema
const review = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    productId: {
        type: ObjectId,
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



// model export
const reviews = mongoose.model('reviews', review);
module.exports = reviews;