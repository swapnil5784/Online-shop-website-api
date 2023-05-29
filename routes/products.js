var express = require("express");
var router = express.Router();
var productModel = require("../models/products");
var categoryModel = require("../models/categories");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
/* GET home page. */

// for e.g POST : /products  
router.post("/", async function (req, res, next) {
  try {
    // const {filterByColor} = req.body;
    // const {} = req.params
    console.log("req.body ===================> ", req.body);
    let condition = [];

    //1.---------------- filter
    let match = {};

    match["$or"] = [];


    if(req.body._id){
      match['_id'] = new ObjectId(req.body._id)
    }

    if(req.body.filterByColor){
      // match['$or'] = []
      req.body.filterByColor.forEach(color => {
        match.$or.push({"color":color})
      });
    }

    
    if(req.body.filterBySize){
      // match['$or'] = []
      req.body.filterBySize.map((size)=>{
        match.$or.push({"size":size})
      })
    }

    if (req.body.isFeatured) {
      match["isfeatured"] = true;
    }

    if (req.body.category) {
      match["category"] = req.body.category;
    }

    if (req.body.isMarkedFavorite) {
      match["isMarkedFavorite"] = true;
    }

    if (req.body.filterByPrice) {
      // match["$or"] = [];
      let arrayOfPriceRange = [...req.body.filterByPrice];
      arrayOfPriceRange.forEach((priceRange) => {
        match.$or.push({
          $and: [
            { price: { $gte: priceRange.min } },
            { price: { $lte: priceRange.max } },
          ],
        });
      });
    }
    console.log("match =============>",match)

    condition.push({
      $match: match,
    });



    //2.----------------- sort

    if (req.body.sortBy) {
      let field = req.body.sortBy.field || "_id";
      let order = -1;
      if (req.body.sortBy.order == "asc") {
        order = 1;
      }
      condition.push({
        $sort: {
          [field]: order,
        },
      });
    }

    //3.------------------ (i)skip-(ii)limit

    let limit = 0;

    if (req.body.limit) {
      limit = parseInt(req.body.limit);
    }

    if (req.body.pagination) {
      let productsInOnePage =
        parseInt(req.body.pagination.productsPerPage) || 8;
      let page = parseInt(req.body.pagination.page) || 1;

      limit = productsInOnePage * page;

      condition.push({
        $limit: limit,
      });

      condition.push({
        $skip: (page - 1) * productsInOnePage,
      });
    }

    //4.------------------- lookup and project
    //default condition must have in pipeline
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
        color:1,
        size:1
      },
    });
    console.log(JSON.stringify(condition,null,3))
    let products = await productModel.aggregate(condition);
    let totalProducts = await productModel.countDocuments({});
    return res.json({
      type: "success",
      status: 200,
      message: `product list `,
      totalProducts: totalProducts,
      data: products,
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

// for e.g /products/featured
// router.get('/featured' , async function(req,res,next){
//   try{
//     let featuredProducts = await productModel.find({"isfeatured":true})
//     return res.json({
//       type:'success',
//       status:200,
//       message:`Featured products`,
//       data:featuredProducts,
//     })
//   }
//   catch(error){
//     console.log('error at /products/featured --> products.js route',error)
//     return res.json({
//       type:'error',
//       status:500,
//       message:`Server error at /products/featured API `,
//     })
//   }
// })

// for e.g /products/favorite
// router.get('/favorite',async function(req,res,next){
//   try{
//     let favoriteProducts = await productModel.find({"isMarkedFavorite":true})
//     return res.json({
//       type:'success',
//       status:200,
//       message:`Favorite products`,
//       data:favoriteProducts,
//     })
//   }
//   catch(error){
//     console.log('error at /products/favorite --> products.js route',error)
//     return res.json({
//       type:'error',
//       status:500,
//       message:`Server error at /products/favorite API `,
//     })
//   }
// })

// for e.g /products/categories
router.get("/categories", async function (req, res, next) {
  try {
    let categories = await categoryModel.find({});
    return res.json({
      type: "success",
      status: 200,
      message: `for /products/categories route`,
      data: categories,
    });
  } catch (error) {
    console.log("error at /products/categories --> products.js route", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/categories API `,
    });
  }
});

// for e.g /products/category/:category
router.get("/categories/:type", async function (req, res, next) {
  try {
    let products = await productModel.find({ category: req.params.type });
    return res.json({
      type: "success",
      status: 200,
      message: `for /products/category/${req.params.type} route`,
      data: products,
    });
  } catch (error) {
    console.log("error at get /products route...", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/${req.params.type} API `,
    });
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
      priceRanges.push({ min: i, max: i + 100 });
    }
    return res.json({
      type: "success",
      status: 200,
      message: `for /products/filters route`,
      data: {
        colors: await productModel.aggregate([
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
        ]),
        sizes: await productModel.aggregate([
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
        ]),
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

// for e.g /products/10
router.get("/:id", async function (req, res, next) {
  try {
    let products = await productModel.findOne({ id: parseInt(req.params.id) });
    return res.json({
      type: "success",
      status: 200,
      message: `for /products/${req.params.id} route`,
      data: products,
    });
  } catch (error) {
    console.log("error at get /products route...", error);
    return res.json({
      type: "error",
      status: 500,
      message: `Server error at /products/${req.params.id} API `,
    });
  }
});

module.exports = router;
