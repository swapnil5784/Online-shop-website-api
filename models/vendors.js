// import 
const mongoose = require('mongoose');

const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const vendor = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }

},options)

// model export
const vendors = mongoose.model('vendors',vendor);
module.exports =  vendors;