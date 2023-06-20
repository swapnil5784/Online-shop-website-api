var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  return res.json({
    name: "swapnil",
    age: 21
  });
});

module.exports = router;
