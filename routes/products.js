var express = require("express");
var router = express.Router();
var productModel = require("../models/products");
var categoryModel = require("../models/categories");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
/* GET home page. */

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
    const {id} = req.params
    let condition = [];

    //1.---------------- filter
    let match = {};

    match["$or"] = [];

    if (id) {
      match["_id"] = new ObjectId(id);
    }

    if (filter?.isFeatured) {
      match["isfeatured"] = true;
    }
    
    if (filter?.category) {
      match["category"] = filter.category;
    }

    if (filter?.isMarkedFavorite) {
      match["isMarkedFavorite"] = true;
    }

    //  nested filters

    if (filter?.price) {
      if (!match.$or.length) {
        filter?.price.map((priceRange)=>{
          match.$or.push({
            $and: [
              { price: { $gte: priceRange.min } },
              { price: { $lte: priceRange.max } },
            ],
          });
        })          
      } 
      // else {
      //   match.$or.forEach((object) => {
      //     console.log('inside else price filter=========================')
      //     // let priceRangeOr = [];
      //     filterByPrice.forEach((priceRange) => {
      //       object.$or.push({
      //         $and: [
      //           { price: { $gte: priceRange.min } },
      //           { price: { $lte: priceRange.max } },
      //         ],
      //       });
      //     });
      //     //  = priceRangeOr;
      //   });
      // }
      // if (match.$or.$or == []) {
      //   match.$or.$or.push({});
      // }
    }

    

    if (filter?.color) {
      if (!match.$or.length) {
        filter.color.map((color)=>{
          match.$or.push({ color: color });
        })
      } else {
        match.$or.map((object)=>{
          let colorArray = [];
          filter?.color.map((color) => {
            colorArray.push({ color: color });
          });
          object["$or"] = colorArray;
        })
      }
    }

    if (filter?.size) {
      if (!match.$or.length) {
        filter?.size.map((size) => {
          match.$or.push({ size: size });
        });
      } else {
        match.$or.map((object) => {
          if (object.$or) {
            if (!object.$or.length) {
              let sizeOr = [];
              filter.size.map((size) => {
                sizeOr.push({ size: size });
              });
              object["$or"] = sizeOr;
            } else {
              object.$or.map((object) => {
                let insideColorOr = [];
                filter?.size.map((size) => {
                  insideColorOr.push({ size: size });
                });
                object.$or = insideColorOr;
              });
            }
          } else {
            let sizeOrArray = [];
            filter?.size.map((size) => {
              sizeOrArray.push({ size: size });
            });
            object.$or = sizeOrArray;
          }
        });
      }
    }


    if(filter?.search){
      console.log("search == > > ",filter?.search);
      if(!match.$or.length){
        match['$or'] = [
          {title: { $regex : filter.search , $options : "i" } },
          {description: { $regex : filter.search , $options : "i" } },
          {category: { $regex : filter.search , $options : "i" } },
        ]
      } else{
          match.$or.map((object)=>{
            if(!object.$or){
              object.$or = [
                {title: { $regex : filter.search , $options : "i" } },
                {description: { $regex : filter.search , $options : "i" } },
                {category: { $regex : filter.search , $options : "i" } },
              ]
            }else{
              object.$or.map((innerObject) => {
                if(!innerObject.$or){
                  innerObject.$or = [
                    {title: { $regex : filter.search , $options : "i" } },
                    {description: { $regex : filter.search , $options : "i" } },
                    {category: { $regex : filter.search , $options : "i" } },
                  ]
                }else{
                  innerObject.$or.map((innerInnerObject)=>{
                    innerInnerObject.$or = [
                      {title: { $regex : filter.search , $options : "i" } },
                      {description: { $regex : filter.search , $options : "i" } },
                      {category: { $regex : filter.search , $options : "i" } },
                    ]
                  }) 
                }

              })
            }
          })
        }

      }
    


    if (!match["$or"].length) {
      delete match.$or;
    }

    condition.push({
      $match: match,
    });

    console.log(" = = = > >",JSON.stringify(condition,null,3));
    let totalFilteredProducts = await productModel.countDocuments(match);

    // console.log("condition =========> ", JSON.stringify(condition, null, 3));

    //2.----------------- sort
    // console.log("sortsort ======================>>> ",sort);

      let field = sort?.field || "_id";
      let order = -1;
      if (sort?.order === "asc") {
        order = 1;
      }
      condition.push({
        $sort:{
          [field]:order
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
        color: 1,
        size: 1,
      },
    });
    console.log("isCategoryListisCategoryListisCategoryList",isCategoryList);
    let data ={
      products : await productModel.aggregate(condition)
    }
    
    if(isCategoryList){
      data ={
        categories : await categoryModel.aggregate([
  
          {
              $lookup :{
                  
                  from:"products",
                  let:{ "name":"$title" },
                  pipeline:[
                  {
                      $match:{
                          $expr :{
                              $eq:["$category","$$name"]
                              
                              }
                          
                         }
                      }
                  ],
                  as:"totalProducts"
                  
                  }
              
              },
              {
                  
                  $project :{
                      
                      isCategoryList:1,
                      totalProducts:{ $size : "$totalProducts"  },
                      image:1,
                      title:1
                      }
                  
                  }
          
          ])
      }
    }

    let totalProducts = data.products?.length;
    return res.json({
      type: "success",
      status: 200,
      message: `product list `,
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

// for e.g /products/categories         [ stopped ]
// router.get("/categories", async function (req, res, next) {
//   try {
//     let categories = await categoryModel.find({});
//     return res.json({
//       type: "success",
//       status: 200,
//       message: `for /products/categories route`,
//       data: categories,
//     });
//   } catch (error) {
//     console.log("error at /products/categories --> products.js route", error);
//     return res.json({
//       type: "error",
//       status: 500,
//       message: `Server error at /products/categories API `,
//     });
//   }
// });

// for e.g /products/category/:category [ stopped ]
// router.get("/categories/:type", async function (req, res, next) {
//   try {
//     let products = await productModel.find({ category: req.params.type });
//     return res.json({
//       type: "success",
//       status: 200,
//       message: `for /products/category/${req.params.type} route`,
//       data: products,
//     });
//   } catch (error) {
//     console.log("error at get /products route...", error);
//     return res.json({
//       type: "error",
//       status: 500,
//       message: `Server error at /products/${req.params.type} API `,
//     });
//   }
// });

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

    // let totalProductsInFilterResponse = await productModel.count({})
    // sizesArray.unshift({
    //   totalProducts: totalProductsInFilterResponse,
    //   size: "all size",
    // });

    // colorsArray.unshift({
    //   totalProducts:totalProductsInFilterResponse,
    //   color: "all color",
    // });

    // priceRanges.unshift({
    //   totalProducts: totalProductsInFilterResponse,
    // })

    return res.json({
      type: "success",
      status: 200,
      message: `for /products/filters route`,
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


module.exports = router;
