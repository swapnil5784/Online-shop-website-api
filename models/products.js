// import 
const mongoose = require('mongoose');

const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const product = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    isfeatured:{
        type:Boolean,
        required:true,
        default:false
    },
    isMarkedFavorite:{
        type:Boolean,
        required:true,
        default:false
    },
    rating:{
        rate:{
            type:Number,
            required:true
        },
        count:{
            type:Number,
            required:true
        }
    }
},options)

// model export
const products = mongoose.model('products',product);
module.exports =  products;