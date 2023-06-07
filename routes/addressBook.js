var express = require('express');
var router = express.Router();
const addressBookModel = require('../models/addressBook')
// for e.g /address
router.get('/', async function (req, res, next) {
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
        console.log('error in /address route', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Error in server at /address route !'
        })
    }
});

// for e.g /address/add
router.post('/add', async function (req, res, next) {
    try {
        let { title, country, name, mobileNo, pincode, addressLineOne, addressLineTwo, landmark, city, state } = req.body
        await addressBookModel.updateOne(
            {
                userId: req.user._id,
                title: title,
            }, {
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
        },
            {
                upsert: true
            })
        return res.json({
            type: 'success',
            status: 200,
            message: 'Address added successfully !'
        })
    }
    catch (error) {
        console.log('error in /address route', error)
        return res.json({
            type: "error",
            status: 500,
            message: 'Error in server at /address route !'
        })
    }
});

// for e.g /address/update/647ed9b9282beb26211b7d09
router.put('/update/:addressId', async function (req, res, next) {
    try {
        console.log("req.body = = > >", req.body, "req.params = = > >", req.params)

        let addressFoundForUpdate = await addressBookModel.countDocuments({ _id: req.params.addressId })

        if (!addressFoundForUpdate) {
            return res.json({
                type: "error",
                status: 409,
                message: `Address not found !`
            })
        }
        await addressBookModel.updateOne({ _id: req.params.addressId }, { $set: req.body })
        return res.json({
            type: "success",
            status: 200,
            message: `Address updated Successfully !`
        })
    }
    catch (error) {
        console.log(`error at Patch: /address/update/${req.params.addressId}`, error);
        return res.json({
            type: "error",
            status: 500,
            message: `Error at Patch: /address/update/${req.params.addressId}`
        })
    }
})

// for e.g /address/remove/647ed9b9282beb26211b7d09
router.delete('/remove/:addressId', async function (req, res, next) {
    try {
        console.log("req.params.addressId = = > >", req.params.addressId);
        let addressFoundForUpdate = await addressBookModel.countDocuments({ _id: req.params.addressId })

        if (!addressFoundForUpdate) {
            return res.json({
                type: "error",
                status: 409,
                message: `Address not found !`
            })
        }
        await addressBookModel.deleteOne({ _id: req.params.addressId })
        return res.json({
            type: "success",
            status: 200,
            message: "Address successfully deleted !"
        })
    }
    catch (error) {
        console.log(`error at /address/remove/${req.params.addressId}`, error);
        return res.json({
            type: "error",
            status: 500,
            message: `Server error due to error at /address/remove/${req.params.addressId} `
        })
    }
})
module.exports = router;
