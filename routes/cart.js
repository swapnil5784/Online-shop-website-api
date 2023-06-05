var express = require('express');
var router = express.Router();

// for e.g /cart 
router.get('/', function (req, res, next) {
    try {
        return res.json({
            type: "success",
            status: 200,
            data: {
                products: "fire"
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

module.exports = router;
