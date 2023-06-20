

// To find user with mentioned email or userId
const findUserByIdorMobile = async (email, mobile) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.users.countDocuments({ $or: [{ email: email }, { mobile: mobile }] })
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

            let data = await db.models.users.create(userBody)
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