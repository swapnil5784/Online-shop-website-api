var express = require("express");
var router = express.Router();
var productModel = require("../models/products");
var categoryModel = require("../models/categories");
var reviewModel = require('../models/reviews')
const cartModel = require('../models/carts')
const favoriteProductModel = require('../models/favoriteProducts')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var { authentication } = require('../comman/middlewares')
const favoriteProducts = require("../models/favoriteProducts");
const CommonFunctions = require('../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

// for e.g /products/review
router.post('/review', authentication, async function (req, res, next) {
  try {
    let { productId, rating, review } = req.body
    let isProductExists = await productModel.countDocuments({ _id: productId })
    if (!isProductExists) {
      return res.status(409).json({
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
    return res.status(200).json({
      type: "success",
      status: 200,
      message: "Review successfully added !"
    })
  }
  catch (error) {
    productLog.error("error at /product/add-review route !", error)
    console.log("error at /product/add-review route !", error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: "Server error at /product/add-review route !"
    })
  }
})

// for e.g /products/review/remove/<reviewId>
router.delete('/review/remove/:reviewId', authentication, async function (req, res, next) {
  try {
    let { reviewId } = req.params
    if (!ObjectId.isValid(reviewId)) {
      return res.status(409).json({
        type: "error",
        status: 409,
        message: "ReviewId is not valid !"
      })
    }
    let reviewToDelete = await reviewModel.countDocuments({ _id: req.params.reviewId })
    if (!reviewToDelete) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "Review not found !"
      })
    }
    await reviewModel.deleteOne({ _id: req.params.reviewId })
    return res.status(200).json({
      type: "success",
      status: 200,
      message: "Review successfully removed !"
    })
  }
  catch (error) {
    productLog.error("error in /products/remove-review route", error)
    console.log("error in /products/remove-review route", error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: "Server error in /products/remove-review route API"
    })
  }
})

// for e.g POST: /products/cart
router.post('/cart', authentication, async function (req, res, next) {
  try {
    let { productId, quantity, isAddedFromShop } = req.body
    let isProductExists = await productModel.countDocuments({ _id: productId })
    if (!isProductExists) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "Product not found !"
      })
    }
    let productToAdd = {
      productId: new ObjectId(productId),
      userId: new ObjectId(req.user._id),
      quantity: quantity
    }
    let condition = {};
    if (isAddedFromShop) {
      condition['$inc'] = {
        quantity: 1
      }
    } else {
      condition['$set'] = {
        quantity: quantity
      }
    }

    const updateCheck = await cartModel.updateOne(
      {
        productId: new ObjectId(productId),
        userId: new ObjectId(req.user._id),
      },
      condition,
      {
        upsert: true
      }
    )

    // console.log("updateCheck", updateCheck);
    return res.status(200).json({
      type: "success",
      status: 200,
      message: `Product added to cart successfully`
    })
  }
  catch (error) {
    productLog.error('Error in /products/cart route ', error)
    console.log('Error in /products/cart route ', error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: 'Server error on /products/cart route'
    })
  }
})

//for e.g GET : /products/cart
router.get('/cart', authentication, async function (req, res, next) {
  try {
    productLog.info("Route : GET = products/review In:routes/product.js ", "req.user._id = = > ", req.user._id)
    let products = await cartModel.aggregate([
      {
        $match: {
          userId: req.user._id
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
        $project: {
          cartId: "$_id",
          _id: 0,
          product: { $arrayElemAt: ["$product", 0] },
          quantity: 1,
          total: { $multiply: ["$quantity", { $arrayElemAt: ["$product.price", 0] }] }
        }
      }
    ])
    // console.log("products = =>>", products)
    if (!products.length) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "No products in cart!",
        data: {
          totalProductsInCart: products.length,
          products: products
        }
      })
    }
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
    productLog.error('error in /products/cart route ', error)
    console.log('error in /products/cart route ', error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: 'server error on /products/cart route'
    })
  }
});

// for e.g DELETE : /products/cart/remove
router.delete('/cart/remove/:cartId', authentication, async function (req, res, next) {
  try {
    let { cartId } = req.params
    productLog.info("Route : DELETE = products/review In:routes/product.js  ", "cartId => => ", cartId);
    if (!cartId) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "CartId not found !"
      })
    }
    if (!ObjectId.isValid(cartId)) {
      return res.status(409).json({
        type: "error",
        status: 409,
        message: "CartIs not valid !"
      })
    }
    let cartFoundForDelete = await cartModel.countDocuments({ _id: cartId })
    if (!cartFoundForDelete) {
      return res.status(409).json({
        type: "error",
        status: 409,
        message: "Cart not found !"
      })
    }
    console.log("cartId", cartId);
    await cartModel.deleteOne({ _id: cartId })
    return res.status(200).json({
      type: "success",
      status: 200,
      message: "Successfully removed from cart."
    })
  }
  catch (error) {
    productLog.error('Error in /cart route ', error)
    console.log('Error in /cart route ', error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: 'Server error on /cart route'
    })
  }
});

// for e.g GET : /products/favorite  & GET : /products/favorite/646f3bac5d3d7c99439ec906
router.get('/favorite/:productId?', authentication, async function (req, res, next) {
  try {
    // console.log("Login user => => ", req.user);
    let { productId } = req.params
    if (productId) {
      if (!ObjectId.isValid(productId)) {
        return res.status(409).json({
          type: "error",
          status: 409,
          message: "ObjectId is not valid !"
        })
      }
      let markedFavoriteAlready = await favoriteProductModel.countDocuments({
        productId: new ObjectId(productId),
        userId: new ObjectId(req.user._id),
      })
      if (markedFavoriteAlready) {
        return res.status(409).json({
          type: "eror",
          status: 409,
          message: "Product already in favorite !"
        })
      }
      await favoriteProductModel.create({
        productId: new ObjectId(productId),
        userId: new ObjectId(req.user._id),
      })
      return res.status(200).json({
        type: "success",
        status: 200,
        message: "Product successfully added to favorite !"
      })
    }
    let products = await favoriteProductModel.aggregate([
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
      }
    ])
    if (!products.length) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "No favorite products found",
        data: {
          products: products
        }
      })
    }
    return res.status(200).json({
      type: "success",
      status: 200,
      data: {
        products: products
      }
    })
  }
  catch (error) {
    console.log('Error in /favorite-products route ', error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: 'Server error on /favorite-products route'
    })
  }
});

// for DELETE : /products/favorite/remove/646f3bac5d3d7c99439ec906
router.delete('/favorite/remove/:productId', authentication, async function (req, res, next) {
  try {
    let { productId } = req.params
    if (!ObjectId.isValid(productId)) {
      return res.status(409).json({
        type: "error",
        status: 409,
        message: "ObjectId is not valid !"
      })
    }
    let documentToDeleteFound = await favoriteProductModel.countDocuments({ productId: productId, userId: req.user._id })
    if (!documentToDeleteFound) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "Product not found !"
      })
    }
    await favoriteProductModel.deleteOne({ productId: productId, userId: req.user._id })
    return res.status(200).json({
      type: "success",
      status: 200,
      message: "Product successfully removed from favorite !"
    })
  }
  catch (error) {
    console.log('error at delete: products/favorite/<productId> ', error)
    return res.status(500).json({
      type: "error",
      status: 500,
      message: "Server at delete: products/favorite/<productId> !"
    })
  }
})

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
    if (!colorsArray.length && !sizesArray.length && !priceRanges.length) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "No filters found !",
        data: {
          colors: colorsArray,
          sizes: sizesArray,
          priceRanges: priceRanges,
        },
      })
    }
    return res.status(200).json({
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
    productLog.error("error at GET /products/filters route...", error)
    console.log("error at get /products/filters route...", error);
    return res.status(500).json({
      type: "error",
      status: 500,
      message: `Server error at /products/filters API `,
    });
  }
});

// for e.g POST : /products
router.post("/:id?", async function (req, res, next) {
  try {
    productLog.info("Route : POST  = /products In:routes/product.js", "=====================> req.body : ", req.body);
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
      // if id in parameter not in format as required
      if (!ObjectId.isValid(id)) {
        return res.status(409).json({
          type: "error",
          status: 409,
          message: 'ObjectId is not valid !'
        })
      }
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

    if (id) {
      condition.pop()
      condition.push({
        $lookup: {
          from: "reviews",
          let: { "id": "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productId", "$$id"]
                }
              }
            },
            {
              $lookup: {
                from: "users",
                let: { "user": "$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$user"]
                      }
                    }
                  }, {
                    $project: {
                      name: 1,
                      profileImage: 1,
                      email: 1,
                      country: 1,
                      _id: 0
                    }
                  }
                ],
                as: "user"
              }
            },
            {
              $project: {
                _id: 0,
                reviewId: "$_id",
                rating: 1,
                review: 1,
                createdOn: 1,
                user: { $arrayElemAt: ["$user", 0] }
              }
            }
          ],
          as: "reviews"
        }
      })
      condition.push({
        $project: {
          _id: 1,
          productId: "$_id",
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
          reviews: 1
        }
      })
    }
    // console.log(JSON.stringify(condition, null, 3))
    let data = {
      products: await productModel.aggregate(condition)
    }
    let totalProducts = data.products?.length;
    if (!data.products.length) {
      return res.status(404).json({
        type: "error",
        status: 404,
        message: "No products found !",
        totalProducts: totalFilteredProducts,
        totalFilteredProducts: totalProducts,
        data: data
      })
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
      if (!data.products.length) {
        return res.status(404).json({
          type: "error",
          status: 404,
          message: "No category found !",
          totalProducts: totalFilteredProducts,
          totalFilteredProducts: totalProducts,
          data: data
        })
      }
    }


    return res.status(200).json({
      type: "success",
      status: 200,
      message: `product list`,
      totalProducts: totalFilteredProducts,
      totalFilteredProducts: totalProducts,
      data: data
    });
  } catch (error) {
    productLog.error("error at post /products route...", error)
    console.log("error at post /products route...", error);
    return res.status(500).json({
      type: "error",
      status: 500,
      message: `Server error in /products/ API `,
    });
  }
});



module.exports = router;

