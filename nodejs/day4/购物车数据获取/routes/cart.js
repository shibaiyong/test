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


module.exports = router;
