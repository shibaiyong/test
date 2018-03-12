/**
 * Created by hasee on 2017/8/16.
 */
/**
 * Created by hasee on 2017/8/15.
 */
/**
 * Created by hasee on 2017/8/15.
 */
var pool = require("./pool");

function  Cart() {}
Cart.prototype.getCartData =function (uid,callback) {

    //获取到数据以后调用callback
   // setTimeout(function () {
        //假设2秒以后数据获取成功
     //   callback([1,1])
   // },2000)

    pool.getConnection(function (err,connection) {

        connection.query("select * from cart,product where cart.uid="+uid+" and product.pid=cart.pid",function (err,results) {
            if(err){
                console.log(err)
            }else {
                //results 购物车信息
                console.log(results)
                callback(results)
            }
            connection.release()

        })

    })
};


Cart.prototype.add = function ({pid,uid,number},callback) {
    //params => {pid,uid,number}
    pool.getConnection(function (err,connection) {
        if(err) { console.log(err)}else {

            //1、应下先判断 购车之前有没有当前的商品
            //2、if(有) =》number+1
            //3、else => insert

            //判断当前用户有没有要添加的商品
            connection.query(`select * from cart where pid=${pid} and uid=${uid}`,function (err,results) {
                if(err) { console.log(err)}else {
                    //results 数组
                    if(results.length){
                        //当前用户添加过要添加的商品 =>让number++
                        var num = results[0].number+1;
                       // var cartid = results[0].cartid//购物车id
                        connection.query(`update cart set number=${num} where pid=${pid} and uid=${uid}`,function (err) {
                            callback(err) //把错误信息给回调函数
                            connection.release()
                        })
                    }else {

                        //没有添加过，就 添加 =>insert
                        connection.query(`insert into cart(uid,pid,number) values(${uid},${pid},${number})`,function (err) {
                            callback(err) //把错误信息给回调函数
                            connection.release()
                        })
                    }
                }
            })




        }
    })

};

Cart.prototype.del = function (cartid,callback) {
    pool.getConnection(function (err,connection) {
        if(err) {console.log(err)}else {
            connection.query("delete from cart where cartid="+cartid,function (err) {
                callback(err);
                connection.release()
            })
        }
    })
    
}

module.exports = Cart;