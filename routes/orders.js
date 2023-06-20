// packages
const express = require('express');
const router = express.Router();


// controller
const { showOrderDetails } = require('../controller/order/showDetails')
const { placeOrder } = require('../controller/order/placeorder')

// For send order details of logged in user
router.get('/:orderId?', showOrderDetails);

// For get order details and place order
router.post('/', validation('place-order'), placeOrder);


module.exports = router;
