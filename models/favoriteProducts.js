const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const favoriteProduct = new mongoose.Schema({
    _user:{
        type:ObjectId,
        required:true
    },
    _product:{
        type:ObjectId,
        required:true
    },

},options)

// model export
const favoriteProducts = mongoose.model('favoriteProducts',favoriteProduct);
module.exports =  favoriteProducts;