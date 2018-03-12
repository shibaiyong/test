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

function  User() {}

User.prototype.getUsers =function (res) {
    //2、获取连接
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

};

User.prototype.login=function (params,callback) {
    //params = {username:11,password:222}
    //和数据库对比

    //1获取连接
    pool.getConnection(function (err,connection) {
        if(err){
            console.log(err)
        }else {
            var sqlStr = `select * from user where username='${params.username}'`;
            //2进行数据库查询
            connection.query(sqlStr,function (err,results) {
                if(err){
                    console.log(err)
                }else {
                    //results 是查询到的用户列表  应该是一条数据
                    console.log(results)
                    if(!results.length){
                        //没有找到对应的用户名（用户名不存在）
                        callback("用户名不存在")
                    }else {
                        //有用户名  [ {username,password,sex,id}  ]
                        if(params.password==results[0].password){ //判断用户输入的密码和数据库的密码是否一致
                            //登录成功
                            callback("登录成功")
                        }else {
                            //用户名和密码不匹配
                            callback("用户名和密码不匹配")
                        }
                    }
                }
                //3释放连接
                connection.release()
            })
        }
    })

};


User.prototype.reg = function ({username,password},callback) {
    //1\获取连接
    pool.getConnection(function (err,connection) {
       if(err){console.log(err)} else {
           //2\注册 ：数据库查询

           //注册添加数据之前，先查询有没有要注册的用户，
           var sqlStr = `select * from user where username='${username}'`;
           connection.query(sqlStr,function (err,results) {
               if(err) { console.log(err)} else {
                    console.log(results)
                   if(results.length){
                        //已经注册过了
                       callback("用户名已经被注册");
                       //3、释放连接
                       connection.release()
                   }else {
                       //没有注册过
                       var regStr =  `insert into user(username,password) values('${username}','${password}')`;
                       connection.query(regStr,function (err) {
                           if(err){
                               console.log(err);
                               //未知错误
                               callback("服务器比较繁忙")
                           }else {
                               //注册成功
                               callback("注册成功")
                           }
                           //3、释放连接
                           connection.release()
                       })
                   }

               }
               
           })
       }
    })

};

module.exports = User;