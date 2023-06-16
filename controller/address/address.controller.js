// packages
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// models
const addressBookModel = require('../../models/addressBook')

// services
const addressBookService = require('../../service/addressBook.service')

// To add address into db as details comes in body
const addAddress = async function (req, res, next) {
    try {
        let { title, country, name, mobileNo, pincode, addressLineOne, addressLineTwo, landmark, city, state } = req.body
        // addressDetails object to save details accroding to shema defined
        let addressDetails = {
            userId: req.user._id,
            title: title,
            name: name,
            country: country,
            mobileNo: mobileNo,
            pincode: pincode,
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            landmark: landmark,
            city: city,
            state: state
        }
        // query to check login user has added address before
        let userHasAddress = await addressBookService.addressExistsOfUser(req.user._id)
        // if user has no addresses then make first address as default
        if (!userHasAddress) {
            addressDetails.isDefault = true
        }
        // query to save address details into db
        let addedAddress = await addressBookService.saveAddress(addressDetails)
        return res.json({
            type: 'success',
            status: 200,
            message: 'Address added successfully !',
            addedAddressId: addedAddress._id
        })
    }
    catch (error) {
        // if error in add address process
        console.log('error in /address route', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Error in server at /address route !'
        })
    }
}

// To remove address from user's address collection
const removeAddress = async function (req, res, next) {
    try {
        // if addressId in url paramter is not in ObjectId format
        if (!ObjectId.isValid(req.params.addressId)) {
            return res.json({
                type: "error",
                status: 409,
                message: `AddressId not valid !`
            })
        }
        // query to get count of address is their in db to delete
        let addressFoundForDelete = await addressBookService.addressExistsWithId(req.params.addressId)
        // if address to delete not found in collection
        if (!addressFoundForDelete) {
            return res.json({
                type: "error",
                status: 409,
                message: `Address not found !`
            })
        }
        // query to delete detials from db
        let deleteConfirmation = await addressBookService.removeAddress(req.params.addressId)
        console.log(deleteConfirmation);
        return res.json({
            type: "success",
            status: 200,
            message: "Address successfully deleted !"
        })
    }
    catch (error) {
        // if error in removing address
        console.log(`error at /address/remove/${req.params.addressId}`, error);
        return res.json({
            type: "error",
            status: 500,
            message: `Server error due to error at /address/remove/${req.params.addressId} `
        })
    }
}

// To update address details as passed in body
const updateAddress = async function (req, res, next) {
    try {
        // if addressId in url paramter is not in ObjectId format
        if (!ObjectId.isValid(req.params.addressId)) {
            return res.json({
                type: "error",
                status: 409,
                message: `AddressId not valid !`
            })
        }
        // query to check if address to update is in db
        let addressFoundForUpdate = await addressBookService.addressExistsWithId(req.params.addressId)
        // if address to update is not found in db
        if (!addressFoundForUpdate) {
            return res.json({
                type: "error",
                status: 404,
                message: `Address not found !`
            })
        }
        // query to update address details
        let updateConfirmation = await addressBookService.updateAddress(req.params.addressId, req.body)
        console.log(updateConfirmation)
        return res.json({
            type: "success",
            status: 200,
            message: `Address updated Successfully !`
        })
    }
    catch (error) {
        // if error in address update process
        console.log(`error at Patch: /address/update/${req.params.addressId}`, error);
        return res.json({
            type: "error",
            status: 500,
            message: `Error at Patch: /address/update/${req.params.addressId}`
        })
    }
}

// To find the logged-in user's addresses
const showAddressList = async function (req, res, next) {
    try {
        let userAddressBook = await addressBookModel.find({ userId: req.user._id }, {
            _id: 0,
            addressId: "$_id",
            userId: 1,
            title: 1,
            country: 1,
            name: 1,
            mobileNo: 1,
            pincode: 1,
            addressLineOne: 1,
            addressLineTwo: 1,
            landmark: 1,
            city: 1,
            state: 1,
        })
        // if user had not added addresses
        if (!userAddressBook.length) {
            return res.json({
                type: "error",
                status: 404,
                message: 'No address found',
                data: {
                    addressBook: userAddressBook
                },
            })
        }
        return res.json({
            type: "success",
            status: 200,
            data: {
                addressBook: userAddressBook
            },
            message: 'Response from /address API.'
        })
    }
    catch (error) {
        // if error in showing address list
        console.log('error in /address route', error)
        return res.status(500).json({
            type: "error",
            status: 500,
            message: 'Error in server at /address route !'
        })
    }
}

//export functions
module.exports = {
    addAddress,
    removeAddress,
    showAddressList,
    updateAddress
}