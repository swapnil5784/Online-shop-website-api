// import 
const mongoose = require('mongoose');

const options = {
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"updatedOn"
    }
}
// model schema
const user = new mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    }

},options)

// model export
const users = mongoose.model('users',user);
module.exports =  users;