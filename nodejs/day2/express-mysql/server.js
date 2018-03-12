/**
 * Created by hasee on 2017/8/15.
 */
var express = require('express');
var app = express(); //生成express的应用

//商品的数据模块
var Product = require("./models/product");
var myPro = new Product();
//用户的数据模块
var User = require("./models/user");
var myUser = new User();

//网站的静态目录设置
app.use(express.static("./public"));

//商品接口
app.get("/api/getGoods",function (req,res) {//需要给前端列表数据
    myPro.getProList(res)
});
//用户接口
app.get("/api/user",function (req,res) {
    myUser.getUsers(res)
});

app.get("/",function (req,res) {
    res.send("hello")
});


app.listen(80);
console.log("running");