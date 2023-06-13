const contactUsController = async function(req,res){
    try{
        const { name , email , message , subject } = req.body
        console.log(name , email , message , req.user._id)
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
module.export ={
    contactUsController,
}