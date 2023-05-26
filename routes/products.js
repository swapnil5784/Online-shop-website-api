var express = require('express');
var router = express.Router();
var productModel = require('../models/products')
var categoryModel = require('../models/categories')
/* GET home page. */

// for e.g /products , /products?page=1 , /products?limit=2 , /products?sort=desc , /products?isFeatured=true 
//         and /products?isMarkedFavorite=true 
router.get('/',async function(req, res, next) {
  try{

    let condition =[]

    //1.---------------- filter
    let match ={

    }
    if(req.query.isFeatured){
      match['isfeatured'] = true
    }

    if(req.query.isMarkedFavorite){
      match['isMarkedFavorite'] = true
    }

    condition.push({
      $match:match
    })

    //2.----------------- sort

    if(req.query.sort){
      condtition.push({
        $sort:{
          _id:-1
        }
      })
    }

    //3.------------------ skip-limit

    if(req.query.page){
      let productsInOnePage = 6 ;
      let page = parseInt(req.query.page)
      condition.push({
          $limit:productsInOnePage*page
      })
      condition.push({
          $skip:(page-1)*productsInOnePage
      })
    }

    if(req.query.limit){
      condition.push({
        $limit:parseInt(req.query.limit)
      })
    }

    //4.------------------- lookup and project
    //default condition must have in pipeline
    condition.push({
      $project:{
        _id:1,
        id : 1,
        title:1,
        price:1,
        description:1,
        category:1,
        image:1,
        rating:1,
        isfeatured:1,
        isMarkedFavorite:1
      }
    })
    
    let products = await productModel.aggregate(condition) 
    let totalProducts = await productModel.countDocuments({})
    return res.json({
      type:'success',
      status:200,
      message:`product list `,
      totalProducts:totalProducts,
      data:products,
    })
  }
  catch(error){
    console.log('error at get /products route...',error)
    return res.json({
      type:'error',
      status:500,
      message:`Server error in /products/ API `,
    })
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
router.get('/categories',async function(req,res,next){
  try{
    let categories = await categoryModel.find({}) 
    return res.json({
      type:'success',
      status:200,
      message:`for /products/categories route`,
      data:categories,
    })
  }
  catch(error){
    console.log('error at /products/categories --> products.js route',error)
    return res.json({
      type:'error',
      status:500,
      message:`Server error at /products/categories API `,
    })
  }
})

// for e.g /products/category/:category
router.get('/categories/:type',async function(req, res, next) {
  try{
    let products = await productModel.find({category:req.params.type})
    return res.json({
      type:'success',
      status:200,
      message:`for /products/category/${req.params.type} route`,
      data:products,
    })
  }
  catch(error){
    console.log('error at get /products route...',error)
    return res.json({
      type:'error',
      status:500,
      message:`Server error at /products/${req.params.type} API `,
    })
  }
});

// for e.g /products/10
router.get('/:id',async function(req, res, next) {
  try{
    let products = await productModel.findOne({id:parseInt(req.params.id)})
    return res.json({
      type:'success',
      status:200,
      message:`for /products/${req.params.id} route`,
      data:products,
    })
  }
  catch(error){
    console.log('error at get /products route...',error)
    return res.json({
      type:'error',
      status:500,
      message:`Server error at /products/${req.params.id} API `,
    })
  }
});


module.exports = router;
