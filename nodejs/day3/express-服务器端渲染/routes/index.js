var express = require('express');
var router = express.Router();

//商品的数据模块
var Product = require("../models/product")
var myPro = new Product();
/* GET home page. */

router.get('/', function(req, res, next) {
  //等获取到数据以后再渲染页面
  myPro.getProList(function (results) {
      console.log(results);
      res.render('index', { title: 'hello',username:'anliman',proListData:results });
  });
    //需要商品的数据
});



module.exports = router;
