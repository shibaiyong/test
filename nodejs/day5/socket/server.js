/**
 * Created by hasee on 2017/8/18.
 */
var express = require("express")
var app = express();


app.use(express.static("./public"));//静态目录不用写路由
app.listen(80,function () {
    console.log("server run at http://10.9.154.24:80")
});


//创建服务器端的socket
var io = require("socket.io").listen(8090);

var users = {};
var number=1;
//监听，如果有用户连接，就打印提示
io.on("connect",function (socket) {







    console.log("有人连接");
    socket.send({
        userInfo:{
            username:"系统消息",
            pic:"images/1.jpg"
        },
        msg:"hello ，欢迎光临17k聊天室！！！"
    });




    var ip = socket.client.conn.remoteAddress
    //users["..24"]
    if(!users[ip]){ //第一次连接的时候，分配用户名和头像
        users[ip] = {
            username:"萌新"+ip,
            pic:"images/3.jpg"
        }
    }
    console.log();

    //给用户发送自己的信息
    socket.emit("selfInfo",users[ip]);




    //当服务器端接收到消息，应该把消息转发给所有人
    socket.on("message",function (msg) {
        //users[ip] 用户信息
        socket.broadcast.send({
            userInfo:users[ip],
            msg:msg
        })
    });

    //监听客户端的改变事件，
    socket.on("changeName",function (newName) {
        //改变用户名
        users[ip].username = newName
    })

    //监听客户端的改变事件，
    socket.on("changePic",function (newPic) {
        //改变用户名
        users[ip].pic = newPic
    })
});