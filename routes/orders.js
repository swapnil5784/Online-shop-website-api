// packages
var express = require('express');
var router = express.Router();


// controller
const { showOrderDetails } = require('../controller/order/showDetails')
const { placeOrder } = require('../controller/order/placeorder')

// For send order details of logged in user
router.get('/:orderId?', showOrderDetails);

// For get order details and place order
router.post('/', placeOrder);


module.exports = router;
