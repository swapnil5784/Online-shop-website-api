//packages
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// To check the product exists with userId passed
const checkProductExistsById = async (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.products.findById(productId);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of product existance file : /service/product.js", error);
            reject(error);
        }
    });
};

// To add review to the product
const addReview = async (reviewDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.reviews.create(reviewDetails);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of add review to product , file : /service/product.js", error);
            reject(error);
        }
    });
};

// To check review exists in collection by reviewId 
const checkReviewExistsById = async (reviewId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.reviews.findById(reviewId);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of check review exists by reviewId , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To delete review by reviewId
const deleteReview = async (reviewId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.reviews.deleteOne({ _id: reviewId });
            resolve(data);
        }
        catch (error) {
            console.log("error in query of delete review reviewId , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To update or insert the cart as matches the condition in db
const updateOrInsertCart = async (userId, productId, condition) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.carts.updateOne(
                {
                    productId: new ObjectId(productId),
                    userId: new ObjectId(userId),
                },
                condition,
                {
                    upsert: true
                }
            );
            resolve(data);
        }
        catch (error) {
            console.log("error in query of update or insert cart , file : /service/product.service.js", error);
            reject(error);
        }
    });
};


// To check the cart exist by cartId
const cartExistsById = async (cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.carts.findById(cartId);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of check cart exists by cartId , file : /service/product.service.js", error);
            reject(error);
        }
    });
};


// To delete the cart by cartId
const deleteCart = async (cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.carts.deleteOne({ _id: cartId });
            resolve(data);
        }
        catch (error) {
            console.log("error in query of delete cart by cartId , file : /service/product.service.js", error);
            reject(error);
        }
    })
};

// To show the poducts in cart with product details
const showCartProducts = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.carts.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: { "productId": "$productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$productId"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    productId: "$_id",
                                    _id: 0,
                                    title: 1,
                                    price: 1,
                                    image: 1
                                }
                            }
                        ],
                        as: "product"
                    }
                },
                {
                    $sort: {
                        createdOn: -1
                    }
                },
                {
                    $project: {
                        cartId: "$_id",
                        _id: 0,
                        product: { $arrayElemAt: ["$product", 0] },
                        quantity: 1,
                        total: { $multiply: ["$quantity", { $arrayElemAt: ["$product.price", 0] }] }
                    }
                }
            ]);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of listing products in cart by userId , file : /service/product.service.js", error);
            reject(error);
        }
    });
};
// TO check the product to mark favorite is already marked or not
const isFavoriteProduct = async (productId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.favoriteProducts.countDocuments({
                productId: new ObjectId(productId),
                userId: new ObjectId(userId),
            });
            resolve(data);
        }
        catch (error) {
            console.log("error in query of check product is already in favorite , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To mark product favorite
const markProductFavorite = async (productId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.favoriteProducts.create({
                productId: productId,
                userId: userId,
            });
            resolve(data);
        }
        catch (error) {
            console.log("error in query of mark product favorite , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To get favorite products as list by userId
const getFavoriteProductsDetails = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.favoriteProducts.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId)
                    }
                },
                {
                    $sort: {
                        createdOn: -1
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: { "productId": "$productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$productId"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    title: 1,
                                    price: 1,
                                    category: 1,
                                    rating: 1,
                                    color: 1,
                                    size: 1,
                                    description: 1,
                                    image: 1
                                }
                            }
                        ],
                        as: "product"
                    }
                },
                {
                    $project: {
                        product: { $arrayElemAt: ["$product", 0] },
                    }
                },
                // {

                // }
            ]);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of listing products which are favorite marked by login-user, file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To remove product from favorite list
const removeFavoriteProduct = async (productId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.favoriteProducts.deleteOne({ productId: productId, userId: userId });
            resolve(data);
        }
        catch (error) {
            console.log("error in query to remove product from favorite , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To count the favorite products of login user
const getFavoriteProductsCount = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.favoriteProducts.countDocuments({ userId: userId });
            resolve(data);
        }
        catch (error) {
            console.log("error in query to count favorite product from favorite , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To find max and min price in all available products
const minMaxPrice = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.products.aggregate([
                {
                    $group: {
                        _id: null,
                        MaximumPrice: { $max: "$price" },
                        MinimumPrice: { $min: "$price" },
                    },
                },
            ]);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of finding maximum and minimum price of all products for filters , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To find products in price-range of [min,max]
const productsInPriceRange = async (min, max) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.products.countDocuments({
                $and: [{ price: { $gte: min } }, { price: { $lte: max } }],
            });
            resolve(data);
        }
        catch (error) {
            console.log("error in query of finding products in price-range , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// To find avilable colors of products
const availableColors = async (min, max) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.models.products.aggregate([
                {
                    $group: {
                        _id: "$color",
                        totalProducts: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        color: "$_id",
                        totalProducts: 1,
                    },
                },
            ]);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of listing available colors in products, file : /service/product.service.js", error);
            reject(error);
        }
    });
};


// To find available sizes of products
const availableSizes = async (min, max) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = db.models.products.aggregate([
                {
                    $group: {
                        _id: "$size",
                        totalProducts: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        size: "$_id",
                        totalProducts: 1,
                    },
                },
            ]);
            resolve(data);
        }
        catch (error) {
            console.log("error in query of listing available sizes in products , file : /service/product.service.js", error);
            reject(error);
        }
    });
};

// export functions
module.exports = {
    // product
    checkProductExistsById,
    // review
    checkReviewExistsById,
    addReview,
    deleteReview,
    // cart
    updateOrInsertCart,
    cartExistsById,
    deleteCart,
    showCartProducts,
    // favorite
    isFavoriteProduct,
    markProductFavorite,
    getFavoriteProductsDetails,
    removeFavoriteProduct,
    getFavoriteProductsCount,
    //filters
    minMaxPrice,
    productsInPriceRange,
    availableColors,
    availableSizes,

};