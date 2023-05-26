// import 
const mongoose = require('mongoose');

const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const category = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    categoryProducts:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }

},options)

// model export
const categories = mongoose.model('categories',category);
module.exports =  categories;