// pakcges
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// commman functions
const CommonFunctions = require('../../common/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products');


// services
const productService = require('../../service/product');

// To add review on product mentioned 
const addReview = async function (req, res, next) {
  try {
    let { productId, rating, review } = req.body;
    // query to check if product exists on which review to add
    let isProductExists = await productService.checkProductExistsById(productId);
    // if product not found to add review 
    if (!isProductExists) {
      return res.json({
        type: "error",
        status: 409,
        message: "No product found to add review !"
      });
    }
    // simple-node-logger log in file
    productLog.info('Route : POST = products/review In:routes/product.js', {
      userId: req.user._id,
      productId: productId,
      review: review,
      rating: rating
    });
    // query to add review on product by storing into a collection
    let reviewDetails = {
      userId: req.user._id,
      productId: productId,
      review: review,
      rating: parseInt(rating)
    };
    await productService.addReview(reviewDetails);
    let product = await db.models.reviews.aggregate([
      {
        $match: {
          userId: new ObjectId(req.user._id),
          productId: new ObjectId(productId)
        }
      },
      {
        $group: {
          _id: ["$userId", "$productId"],
          count: {
            $sum: 1
          },
          rating: {
            $sum: "$rating"
          }
        }
      }
    ]);
    let reviewCountOnProduct = await db.models.reviews.countDocuments({ userId: req.user._id, productId: productId });
    await db.models.products.updateOne({ _id: productId }, { $set: { "rating.rate": ((product[0].rating) / reviewCountOnProduct), "rating.count": reviewCountOnProduct } });
    return res.json({
      type: "success",
      status: 200,
      message: "Review successfully added !"
    });
  }
  catch (error) {
    // if error while adding review on product
    productLog.error("error at /product/add-review route !", error);
    console.log("error at /product/add-review route !", error);
    return res.json({
      type: "error",
      status: 500,
      message: "Server error at /product/add-review route !"
    });
  }
};

// To remove review from product
const deleteReview = async function (req, res, next) {
  try {
    let { reviewId } = req.params;
    if (!ObjectId.isValid(reviewId)) {
      return res.json({
        type: "error",
        status: 409,
        message: "ReviewId is not valid !"
      });
    }
    // query to remove a review from collection
    await productService.deleteReview(req.params.reviewId);
    return res.json({
      type: "success",
      status: 200,
      message: "Review successfully removed !"
    });
  }
  catch (error) {
    // error while removing a review
    productLog.error("error in /products/remove-review route", error);
    console.log("error in /products/remove-review route", error);
    return res.json({
      type: "error",
      status: 500,
      message: "Server error in /products/remove-review route API"
    });
  }
};

// exports
module.exports = {
  addReview,
  deleteReview,
};