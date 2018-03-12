/**
 * Created by hasee on 2017/8/15.
 */
var pool = require("./pool");

function  Product() {}

Product.prototype.getProList=function (callback) {
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
                    //请求数据成功以后，调用回调函数，把数据给回调函数
                    callback(results);
                    //4、把连接放回池子
                    connection.release()
                }
            })
        }
    })

};

module.exports = Product;