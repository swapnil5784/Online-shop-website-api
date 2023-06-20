//packages
const express = require('express');
const router = express.Router();

// Middlewares


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
router.post('/add', validation("save-address"), addAddress);

// For get address details to update and update into db
router.put('/update/:addressId', validation("update-address"), updateAddress)

// For delete address details
router.delete('/remove/:addressId', validation("remove-address"), removeAddress);

//export
module.exports = router;
