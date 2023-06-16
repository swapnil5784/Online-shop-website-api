const addressBookModel = require('../models/addressBook')

const addressExistsOfUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await addressBookModel.countDocuments({ userId: userId })
            resolve(data)
        }
        catch (error) {
            console.log("error in address exists with userId query at file: /services/addressBook.service.js", error)
            reject(error)
        }
    })
}

const saveAddress = async (address) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await addressBookModel.create(address)
            resolve(data)
        }
        catch (error) {
            console.log("error in saved address  query at file: /services/addressBook.service.js", error)
            reject(error)
        }
    })
}

const addressExistsWithId = async (addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await addressBookModel.countDocuments({ _id: addressId })
            resolve(data)
        }
        catch (error) {
            console.log("error in address exists with addressId query at file: /services/addressBook.service.js", error)
            reject(error)
        }
    })
}

const removeAddress = async (addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await addressBookModel.deleteOne({ _id: addressId })
            resolve(data)
        }
        catch (error) {
            console.log("error in address exists with addressId query at file: /services/addressBook.service.js", error)
            reject(error)
        }
    })
}

const updateAddress = async (addressId, detailsToUpdate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await addressBookModel.updateOne({ _id: addressId }, { $set: detailsToUpdate })
            resolve(data)
        }
        catch (error) {
            console.log("error in address exists with addressId query at file: /services/addressBook.service.js", error)
            reject(error)
        }
    })
}

module.exports = {
    addressExistsOfUser,
    addressExistsWithId,
    saveAddress,
    removeAddress,
    updateAddress
}