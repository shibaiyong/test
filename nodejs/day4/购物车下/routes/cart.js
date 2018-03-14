var express = require('express');
var router = express.Router();

//购物车的数据模块
var Cart = require("../models/cart");
var myCart = new Cart();

router.get('/', function(req, res, next) {
  //通过session 获取用户id
  if(req.session.user){
    var uid = req.session.user.uid;
    //先获取购物车数据
    myCart.getCartData(uid,function (results) {
      //results 应该是购物车数据
      res.render("cart",{cartData:results,title:"购物车"})
    })
  }else {
    //没有登录
    res.render("cart",{cartData:[],title:"购物车未登录"})
  }
});

router.get("/add",function (req,res,next) {
  console.log(req.session);
  if(req.session.user){
    //获取添加商品的必要参数
    var params = {
      pid:req.query.pid,
      uid:req.session.user.uid,
      number:1
    };
    //把参数传递数据模块
    myCart.add(params,function (err) {
      var msg = {
        msgStatus:"ok",
        msgInfo:"添加成功",
        msgCode:1
      };
      if(err){
        msg = {
          msgStatus:"err",
          msgInfo:"添加失败，服务器繁忙",
          msgCode:0
        }
      }
      res.send(JSON.stringify(msg))
    })//需要uid，pid，number
  }else {
    //没有登录
    res.send(JSON.stringify({
      msgStatus:"err",
      msgInfo:"未登录",
      msgCode:0
    }))
  }
});

//0 错误 //1成功  //2 小问题1  //3 小问题3  //4 小问题3
//删除接口
router.get("/delete",function (req,res,next) {
  if(req.session.user){
    //删除
    var cartid = req.query.cartid
    console.log(cartid)
    //调用cart的数据模块进行数据库数据的删除
    myCart.del(cartid,function (err) {
      if(err){
        //删除失败
        res.send({
          msgStatus:"err",
          msgInfo:"登录失效，请重新登录",
          msgCode:0
        })
      }else {
        //删除成功
        res.send({
          msgStatus:"ok",
          msgInfo:"删除成功",
          msgCode:1
        })
      }
    })
  }else {
    //登录失效
    res.send({
      msgStatus:"err",
      msgInfo:"登录失效，请重新登录",
      msgCode:0
    })
  }
});


module.exports = router;
