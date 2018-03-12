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

module.exports = Cart;