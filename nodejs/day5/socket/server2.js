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

//监听，如果有用户连接，就打印提示
io.on("connect",function (socket) {

    console.log("有人连接");
    socket.send("欢迎进入 17k网站，请问有什么可以帮助您吗？");

    socket.on("message",function (msg) {
        var sendMsg = "";
        switch (msg){
            case 'hello':
                sendMsg ="hello ,what can I do for you?";
                break
            case "你好" :
                sendMsg = "您好，请问有什么可以帮助您吗";
                break
            default:
                sendMsg = "这个问题超过了我的智商,<a href='https://www.baidu.com/s?wd="+msg+"' target='_blank'>百度一下吧</a>"

        }

        socket.send(sendMsg)
    })

});