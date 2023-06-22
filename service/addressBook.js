
// To check user has any address exists in db
const addressExistsOfUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.addressBook.countDocuments({ userId: userId });
            resolve(data);
        }
        catch (error) {
            console.log("error in address exists with userId query at file: /services/addressBook.service.js", error);
            reject(error);
        }
    });
};

// To save address details to db userwise
const saveAddress = async (address) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.addressBook.create(address);
            resolve(data);
        }
        catch (error) {
            console.log("error in saved address  query at file: /services/addressBook.service.js", error);
            reject(error);
        }
    });
};

// To check address exists in db with mentioned addressId
const addressExistsWithId = async (addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.addressBook.countDocuments({ _id: addressId });
            resolve(data);
        }
        catch (error) {
            console.log("error in address exists with addressId query at file: /services/addressBook.service.js", error);
            reject(error);
        }
    });
};

// To remove address userSpecific from db
const removeAddress = async (addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.addressBook.deleteOne({ _id: addressId });
            resolve(data);
        }
        catch (error) {
            console.log("error in address exists with addressId query at file: /services/addressBook.service.js", error);
            reject(error);
        }
    });
};

// TO update address userSpecific
const updateAddress = async (addressId, detailsToUpdate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.addressBook.updateOne({ _id: addressId }, { $set: detailsToUpdate });
            resolve(data);
        }
        catch (error) {
            console.log("error in address exists with addressId query at file: /services/addressBook.service.js", error);
            reject(error);
        }
    });
};

// export functions
module.exports = {
    addressExistsOfUser,
    addressExistsWithId,
    saveAddress,
    removeAddress,
    updateAddress
};