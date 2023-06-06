const usermodel = require('../../models/users')

const findUserByIdorMobile = async (email, mobile) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await usermodel.countDocuments({ $or: [{ email: email }, { mobile: mobile }] })
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

module.exports = {
    findUserByIdorMobile,
    createUser
}