const addReview = async function (req, res, next) {
    try {
      let { productId, rating, review } = req.body
      let isProductExists = await productModel.countDocuments({ _id: productId })
      if (!isProductExists) {
        return res.json({
          type: "error",
          status: 409,
          message: "No product found to add review !"
        })
      }
      productLog.info('Route : POST = products/review In:routes/product.js', {
        userId: req.user._id,
        productId: productId,
        review: review,
        rating: rating
      })
      await reviewModel.create({
        userId: req.user._id,
        productId: productId,
        review: review,
        rating: rating
      })
      return res.json({
        type: "success",
        status: 200,
        message: "Review successfully added !"
      })
    }
    catch (error) {
      productLog.error("error at /product/add-review route !", error)
      console.log("error at /product/add-review route !", error)
      return res.json({
        type: "error",
        status: 500,
        message: "Server error at /product/add-review route !"
      })
    }
  }

  const deleteReview =  async function (req, res, next) {
    try {
      let { reviewId } = req.params
      if (!ObjectId.isValid(reviewId)) {
        return res.json({
          type: "error",
          status: 409,
          message: "ReviewId is not valid !"
        })
      }
      let reviewToDelete = await reviewModel.countDocuments({ _id: req.params.reviewId })
      if (!reviewToDelete) {
        return res.json({
          type: "error",
          status: 404,
          message: "Review not found !"
        })
      }
      await reviewModel.deleteOne({ _id: req.params.reviewId })
      return res.json({
        type: "success",
        status: 200,
        message: "Review successfully removed !"
      })
    }
    catch (error) {
      productLog.error("error in /products/remove-review route", error)
      console.log("error in /products/remove-review route", error)
      return res.json({
        type: "error",
        status: 500,
        message: "Server error in /products/remove-review route API"
      })
    }
  }


  module.exports = {
    addReview,
    deleteReview
  }