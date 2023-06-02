// import 
const mongoose = require('mongoose');

const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const subscriber = new mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    }

},options)

// model export
const subscribers = mongoose.model('subscribers',subscriber);
module.exports =  subscribers;