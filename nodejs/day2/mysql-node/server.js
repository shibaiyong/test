/**
 * Created by hasee on 2017/8/15.
 */

var http = require("http");
var mysql = require("mysql");
http.createServer(function (req,res) {
    if(req.url==="/api/getGoods"){
        //用户需要商品数据
        //mysql
        //1、创建连接
        var connection = mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"root",
            database:"my1709",
            port:"3306"
        });

        //2、链接
        connection.connect(function (err) {
            if(err){
                console.log(err)
            }else{
                console.log("[connection connect] success")
            }
        });

        //3、数据库操作
        connection.query("select * from product",function (err,results) {
            if(err){
                console.log(err)
            }else{
                //results 就是商品数据
                console.log(results) //array
                res.write(JSON.stringify(results))
                res.end()
            }
        });

        //4、释放连接
        connection.end(function (err) {
            if(err){
                console.log(err)
            }else{
                console.log("[connection end] success")
            }
        });


    }else {
        res.write("hello mysql");
        res.end()
    }






}).listen(80);

console.log("running");
