var express = require('express');
var router = express.Router();
var moment = require('moment')
const orderModel = require('../models/orders')
const orderDetailModel = require('../models/orderDetails')
const cartModel = require('../models/carts')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


// functions from controller
const { showOrderDetails } = require('../controller/order/showDetails')
const { placeOrder } = require('../controller/order/placeorder') 
/* GET users listing. */

// for e.g GET : /orders
router.get('/', showOrderDetails);

// for e.g POST : /orders
router.post('/', placeOrder);

module.exports = router;
