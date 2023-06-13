const contactUsModel = require('../../models/contactUs.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const contactUsController = async(req,res)=>{
    try{
        const { name , email , message ,subject } = req.body
        // console.log(name , email , message , subject, req.user._id.toString())
        let contactObject = {
            userId:new ObjectId(req.user._id.toString()),
            name:name,
            email:email,
            subject:subject,
            message:message
        }
        await contactUsModel.create(contactObject)
        return res.json({
            type:"success",
            status:200,
            message:"Message successfully stored !"
        }) 
    }
    catch(error){
        console.log("error in contactUsController controller",error)
        return res.json({
            type:"error",
            status:500,
            message:"Server error at /contact-us route !"
        })
    }
}
module.exports = {
    contactUsController,
}