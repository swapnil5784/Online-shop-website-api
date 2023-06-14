//packages
var express = require('express');
var router = express.Router();

// controllers
const {
    addAddress,
    removeAddress,
    showAddressList,
    updateAddress
} = require('../controller/address/address.controller')

// For send address list in response
router.get('/', showAddressList);

// For get address details in body and store to db
router.post('/add', addAddress);

// For get address details to update and update into db
router.put('/update/:addressId', updateAddress)

// For delete address details
router.delete('/remove/:addressId', removeAddress)

//export
module.exports = router;
