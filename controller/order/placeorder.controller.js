// packages
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// const orderLog = commonFn.Logger('orders')
module.exports = {
    // function to place order
    placeOrder: async function (req, res, next) {
        try {
            // query to get number of products in cart
            let isCartEmpty = await db.models.carts.countDocuments({ userId: req.user._id });
            // if cart is empty
            if (!isCartEmpty) {
                orderLog.error("Cart is empty cant do order!")
                return res.json({
                    type: "error",
                    status: 409,
                    message: "Cart is empty cant do order!"
                });
            }
            let { shipToDifferentAddress, billingId, deliveryId, totalAmount, shippingAmount, paymentMethod } = req.body;
            let orderObject = {
                billingId: new ObjectId(billingId),
                deliveryId: new ObjectId(billingId),
                userId: new ObjectId(req.user._id),
                totalAmount: parseInt(totalAmount),
                shippingAmount: parseInt(shippingAmount),
                paymentMethod: paymentMethod
            };
            // if shipping and delivery addresses are different 
            if (shipToDifferentAddress) {
                if (!deliveryId) {
                    // orderLog.error("DeliveryId not found !")
                    return res.json({
                        type: "error",
                        status: 409,
                        message: "DeliveryId not found !"
                    });
                }
                if (deliveryId) {
                    if (!ObjectId.isValid(deliveryId)) {
                        // orderLog.error("DeliveryId is not valid !")
                        return res.json({
                            type: "error",
                            status: 409,
                            message: "DeliveryId is not valid !"
                        });
                    }
                }
                orderObject.deliveryId = new ObjectId(deliveryId);
            }
            // query to store order details into db
            await db.models.orders.create(orderObject);
            return res.json({
                type: "success",
                status: 200,
                message: 'Order successfully placed !'
            });
        }
        catch (error) {
            // if error in place order process
            // orderLog.error("error at POST : /order", error)
            console.log("error at POST : /order", error);
            return res.json({
                type: "error",
                status: 500,
                message: "Server error at POST : /order !"
            });
        }
    }
};