/**
 * Created by hasee on 2017/8/15.
 */
var pool = require("./pool");

function  Product() {}

Product.prototype.getProList=function (res) {
    //2、获取连接
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

};

module.exports = Product;