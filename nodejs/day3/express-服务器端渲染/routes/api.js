var express = require('express');
var router = express.Router();
var Product = require("../models/product")
var myPro = new Product();
//api/getGoods
router.get("/getGoods",function (req,res,next) {
    //需要商品的数据
    ///myPro.getProList(res)
});

module.exports = router;
