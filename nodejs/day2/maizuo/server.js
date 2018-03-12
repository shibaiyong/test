/**
 * Created by hasee on 2017/8/15.
 */
var express = require("express");
var proxy = require("http-proxy-middleware"); //代理的中间件
var app = express();


app.use(express.static("./dist")); //设置静态目录，让dist目录可以直接访问

//设置服务器代理
app.use("/api",proxy({
    "target": "http://aura.maizuo.com/api",
    "changeOrigin": true,
    "pathRewrite": {
        "^/api": ""
    }
}));
app.use("/ma/api",proxy({
    "target": "http://apim.modernavenue.com/ma/api",
    "changeOrigin": true,
    "pathRewrite": {
        "^/ma/api": ""
    }
}));

/*"/api": {
 "target": "http://aura.maizuo.com/api",
 "changeOrigin": true,
 "pathRewrite": {
 "^/api": ""
 }
 },
 "/ma/api": {
 "target": "http://apim.modernavenue.com/ma/api",
 "changeOrigin": true,
 "pathRewrite": {
 "^/ma/api": ""
 }
 }*/

app.listen(8030,function () {
    console.log("running")
});