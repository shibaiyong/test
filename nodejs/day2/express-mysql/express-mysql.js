/**
 * Created by hasee on 2017/8/15.
 */
var express = require('express');
var app = express(); //生成express的应用
var mysql = require('mysql');
//使用静态目录  express.static
// app.use(express.static("./views")); //根目录直接可以访问html
// app.use("/images",express.static("./images")); //通过images目录访问图片
app.use(express.static("./public"));

//1、创建一个池子
var pool = mysql.createPool({
    host:"localhost",
    port:"3306",
    user:'root',
    password:"root",
    database:'my1709',
    connectionLimit:10
});

app.get("/api/getGoods",function (req,res) {//需要给前端列表数据
    //2、需要连接的时候，获取连接
    pool.getConnection(function (err,connection) {
        if(err){
            console.log(err)
        }else {
            //3、使用连接
            connection.query("select * from product",function (err,results) {
                if(err){
                    console.log(err)
                }else {
                    //请求成功，把数据给前端
                    res.send(JSON.stringify(results));
                    //4、把连接放回池子
                    connection.release()
                }
            })
        }
    })
});

app.get("/api/user",function (req,res) {
    //2、需要连接的时候，获取连接
    pool.getConnection(function (err,connection) {
        if(err){
            console.log(err)
        }else {
            //3、使用连接
            connection.query("select * from user",function (err,results) {
                if(err){
                    console.log(err)
                }else {
                    //请求成功，把数据给前端
                    res.send(JSON.stringify(results));
                    //4、把连接放回池子
                    connection.release()
                }
            })
        }
    })
});




app.get("/",function (req,res) {
    res.send("hello")
});


app.listen(80);
console.log("running");