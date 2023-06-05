const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const cart = new mongoose.Schema({
    _user:{
        type:ObjectId,
        required:true
    },
    _product:{
        type:ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }


},options)

// model export
const carts = mongoose.model('carts',cart);
module.exports =  carts;