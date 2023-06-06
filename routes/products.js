var express = require("express");
var router = express.Router();
var productModel = require("../models/products");
var categoryModel = require("../models/categories");
var reviewModel = require('../models/reviews')
const cartModel = require('../models/carts')

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var authenticate = require('../middlewares/auth')
/* GET home page. */

// for e.g /products/add-review
router.post('/add-review', authenticate, async function (req, res, next) {
  try {
    let { productId, rating, review } = req.body
    console.log({
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
    console.log("error at /product/add-review route !", error)
    return res.json({
      type: "error",
      status: 500,
      message: "Server error at /product/add-review route !"
    })
  }
})

// for e.g /products/update-review
router.put('/update-review', authenticate, async function (req, res, next) {
  try {
    let { reviewId, rating, review } = req.body
    let reviewToUpdate = await reviewModel.countDocuments({ _id: reviewId })
    if (!reviewToUpdate) {
      return res.json({
        type: "error",
        status: 409,
        message: 'Review not found!'
      })
    }
    let updateDetails = {
      _id: reviewId,
      rating: rating,
      review: review
    }
    console.log("updateDetails = = > > ", updateDetails)
    await reviewModel.updateOne({ _id: reviewId }, { $set: { rating: rating, review: review } })
    return res.json({
      type: "success",
      status: 200,
      message: 'Review updated successfully!'
    })
  }
  catch (error) {
    console.log("error in /products/update-review", error);
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error in /products/update-review API'
    })
  }
})

// for e.g /products/remove-review
router.delete('/remove-review/:reviewId', authenticate, async function (req, res, next) {
  try {
    let reviewToDelete = await reviewModel.countDocuments({ _id: req.params.reviewId })
    if (!reviewToDelete) {
      return res.json({
        type: "error",
        status: 409,
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
    console.log("error in /products/remove-review route", error)
    return res.json({
      type: "error",
      status: 500,
      message: "Server error in /products/remove-review route API"
    })
  }
})

// for e.g POST: /products/cart
router.post('/cart', authenticate, async function (req, res, next) {
  try {
    console.log("req.params.cartId = = > ", req.params.cartId);
    let { productId, quantity } = req.body
    let productToAdd = {
      productId: new ObjectId(productId),
      userId: new ObjectId(req.user._id),
      quantity: quantity
    }
    const updateCheck = await cartModel.updateOne(
      {
        productId: new ObjectId(productId),
        userId: new ObjectId(req.user._id),
      },
      {
        $set: productToAdd
      },
      {
        upsert: true
      })

    console.log("updateCheck", updateCheck);
    return res.json({
      type: "success",
      status: 200,
      message: `Product added to cart successfully`
    })
  }
  catch (error) {
    console.log('Error in /cart route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /cart route'
    })
  }
})

//for e.g GET : /products/cart
router.get('/cart', authenticate, async function (req, res, next) {
  try {
    let products = await cartModel.aggregate([
      {
        $match: {
          user: req.user._id
        }
      },
      {
        $lookup: {
          from: "products",
          let: { "productId": "$_product" },
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
        $project: {

          product: { $arrayElemAt: ["$product", 0] },
          quantity: 1,
          total: { $multiply: ["$quantity", { $arrayElemAt: ["$product.price", 0] }] }
        }
      }
    ])
    return res.json({
      type: "success",
      status: 200,
      data: {
        totalProductsInCart: products.length,
        products: products
      }
    })
  }
  catch (error) {
    console.log('error in /cart route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'server error on /cart route'
    })
  }
});

// for e.g DELETE : /products/cart/remove
router.delete('/cart/remove/:cartId', async function (req, res, next) {
  try {
    console.log("cartId => => ", req.params.cartId);
    if (!req.params.cartId) {
      return res.json({
        type: "error",
        status: 409,
        message: "CartId not found !"
      })
    }
    let cartFoundForDelete = await cartModel.countDocuments({ _id: req.params.cartId })
    if (!cartFoundForDelete) {
      return res.json({
        type: "error",
        status: 409,
        message: "Cart not found !"
      })
    }
    console.log("cartId", req.params.cartId);
    await cartModel.deleteOne({ _id: req.params.cartId })
    return res.json({
      type: "success",
      status: 200,
      message: "Successfully removed from cart."
    })
  }
  catch (error) {
    console.log('Error in /cart route ', error)
    return res.json({
      type: "error",
      status: 500,
      message: 'Server error on /cart route'
    })
  }
});

// for e.g /products/filters
router.get("/filters", async function (req, res, next) {
  try {
    let maxPriceDetails = await productModel.aggregate([
      {
        $group: {
          _id: null,
          MaximumPrice: { $max: "$price" },
          MinimumPrice: { $min: "$price" },
        },
      },
    ]);
    let priceRanges = [];
    for (
      let i = Math.floor(maxPriceDetails[0].MinimumPrice);
      i < Math.ceil(maxPriceDetails[0].MaximumPrice);
      i = i + 100
    ) {
      priceRanges.push({
        min: i,
        max: i + 100,
        totalProducts: await productModel.countDocuments({
          $and: [{ price: { $gte: i } }, { price: { $lte: i + 100 } }],
        }),
      });
    }
    let colorsArray = await productModel.aggregate([
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

    let sizesArray = await productModel.aggregate([
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

    return res.json({
      type: "success",
      status: 200,
      message: `response from /products/filters to render filter details`,
      data: {
        colors: colorsArray,
        sizes: sizesArray,
        priceRanges: priceRanges,
      },
    });
  } catch (error) {
    console.log("error at get /products/filters route...", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/filters API `,
    });
  }
});

// for e.g POST : /products
router.post("/:id?", async function (req, res, next) {
  try {
    console.log("=====================> req.body : ", req.body);

    const {
      filter,
      sort,
      pagination,
      isCategoryList,
    } = req.body;
    const { id } = req.params
    let condition = [];

    //1.---------------- filter
    let match = {};

    // match["$or"] = [];

    // filter products by _id                    [ params ]
    if (id) {
      match["_id"] = new ObjectId(id);
    }
    // filter products which is featured         [ body ]
    if (filter?.isFeatured) {
      match["isfeatured"] = true;
    }
    // filter products by category               [ body ]
    if (filter?.category) {
      match["category"] = filter.category;
    }
    // filter products which are favorite marled [ body ]
    if (filter?.isMarkedFavorite) {
      match["isMarkedFavorite"] = true;
    }

    // filter price
    if (filter?.price) {
      let priceRangeArray = []
      filter.price.map((range) => {
        priceRangeArray.push({
          $and: [
            { price: { $lte: range.max } },
            { price: { $gte: range.min } },
          ]
        })
      })
      match.$or = priceRangeArray
    }

    // filter colors in product
    if (filter?.color) {
      match.color = { $in: filter.color }
    }

    // filter sizes in product
    if (filter?.size) {
      match.size = { $in: filter.size }
    }

    // console.log(`match.$or===>>`,match);
    // removes $or field from match if $or is empty
    if (!match["$or"]?.length) {
      delete match.$or;
    }

    condition.push({
      $match: match,
    });

    // filter products on search
    if (filter?.search) {
      condition.push({
        $match: {
          $or: [
            { title: { $regex: filter.search, $options: "i" } },
            { description: { $regex: filter.search, $options: "i" } },
            { category: { $regex: filter.search, $options: "i" } },
          ]
        }
      })
    }


    // console.log(" = = = > >",JSON.stringify(condition,null,3));
    let totalFilteredProducts = await productModel.countDocuments(match);

    // console.log("condition =========> ", JSON.stringify(condition, null, 3));

    //2.----------------- sort

    let field = sort?.field || "_id";
    let order = -1;
    if (sort?.order === "asc") {
      order = 1;
    }
    condition.push({
      $sort: {
        [field]: order
      }
    })


    //3.------------------ (i)skip-(ii)limit

    // let limitDefault = 0;

    // if (limit) {
    //   limitDefault = parseInt(limit);
    // }

    if (pagination) {
      let productsInOnePage = parseInt(pagination.productsPerPage) || 8;
      let page = parseInt(pagination.page) || 1;

      limitDefault = productsInOnePage * page;
      condition.push({
        $limit: limitDefault,
      });
      condition.push({
        $skip: (page - 1) * productsInOnePage,
      });
    }

    //4.------------------- lookup and project
    condition.push({
      $project: {
        _id: 1,
        id: 1,
        title: 1,
        price: 1,
        description: 1,
        category: 1,
        image: 1,
        rating: 1,
        isfeatured: 1,
        isMarkedFavorite: 1,
        color: 1,
        size: 1,
      },
    });
    let data = {
      products: await productModel.aggregate(condition)
    }

    if (isCategoryList) {
      data = {
        categories: await categoryModel.aggregate([

          {
            $lookup: {

              from: "products",
              let: { "name": "$title" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$category", "$$name"]

                    }

                  }
                }
              ],
              as: "totalProducts"

            }

          },
          {

            $project: {

              isCategoryList: 1,
              totalProducts: { $size: "$totalProducts" },
              image: 1,
              title: 1
            }

          }

        ])
      }
    }

    let totalProducts = data.products?.length;
    return res.json({
      type: "success",
      status: 200,
      message: `product list`,
      totalProducts: totalFilteredProducts,
      totalFilteredProducts: totalProducts,
      data: data
    });
  } catch (error) {
    console.log("error at get /products route...", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error in /products/ API `,
    });
  }
});




module.exports = router;

