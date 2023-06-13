const CommonFunctions = require('../../comman/functions');
const commonFn = new CommonFunctions();
const productLog = commonFn.Logger('products')

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// import models
var productModel = require("../../models/products");
var reviewModel = require('../../models/reviews')


const getProducts = async function (req, res, next) {
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
          return res.json({
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
      if (!data?.products?.length) {
        return res.json({
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
        if (!data?.categories?.length) {
          return res.json({
            type: "error",
            status: 404,
            message: "No category found !",
            data: data
          })
        }
      }
  
  
      return res.json({
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
      return res.json({
        type: "error",
        status: 500,
        message: `Server error in /products/ API `,
      });
    }
  }

  module.exports ={
    getProducts
  }