
// packages
const md5 = require('md5');


// To check user with mentioned email exists or not
const userWithEmailExists = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.users.countDocuments({ email: email });
            resolve(data);
        }
        catch (error) {
            console.log("error at forgot service", error);
            reject(error);
        }
    });
};

// To update user document with otp and its expiry time
const updateUser = async (email, otp, otpExpireAt) => {
    return new Promise(async (resolve, reject) => {
        try {
            let updateMessage = await db.models.users.updateOne({ email: email }, { resetOtp: otp, otpExpiredAt: otpExpireAt });
            resolve(updateMessage);
        }
        catch (error) {
            console.log("error at updateUser in forgot service  ", error);
            reject(error);
        }
    });
};

// To find user with email mentioned
const findUser = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.models.users.findOne({ email: email }).lean();
            resolve(user);
        }
        catch (error) {
            console.log("error in findUser at forgot service !", error);
            reject(error);
        }
    });
};

// TO update userDetail in collection
const updatePassword = async (email, resetOtp, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let message = await db.models.users.updateOne({ email: email, resetOtp: resetOtp }, { password: md5(newPassword) });
            resolve(message);
        }
        catch (error) {
            console.log('error at updatePassword in forgot service !', error);
            reject(error);
        }
    });
};

// To find user with mentioned email or userId
const findUserByIdOrMobile = async (email, mobile) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.users.countDocuments({ $or: [{ email: email }, { mobile: mobile }] });
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

// To register user 
const createUser = async (userBody) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.models.users.create(userBody);
            if (data) {
                resolve(data);
            } else {
                reject(data);
            }
        } catch (error) {
            reject(error);
        }
    });
};


// exports
module.exports = {
    findUserByIdOrMobile,
    createUser,
    userWithEmailExists,
    updateUser,
    findUser,
    updatePassword,
};