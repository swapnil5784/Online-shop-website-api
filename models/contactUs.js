const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const message = {
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
}
// model schema
const message = new mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },

}, options)

// model export
const messages = mongoose.model('messages', message);
module.exports = messages;