// models
const usermodel = require('../../models/users')

// To find user with mentioned email or userId
const findUserByIdorMobile = async (email, mobile) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await usermodel.countDocuments({ $or: [{ email: email }, { mobile: mobile }] })
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

// To register user 
const createUser = async (userBody) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await usermodel.create(userBody)
            if (data) {
                resolve(data)
            } else {
                reject(data)
            }
        } catch (error) {
            reject(error)
        }
    })
}

// exports
module.exports = {
    findUserByIdorMobile,
    createUser
}