var http = require('http')
var url  =require("url")
var querystring = require("querystring")

var files = require("./files")
http.createServer(function(req,res){
    if(req.url=="/favicon.ico") return 
    var urlObj = url.parse(req.url,true) //把url、转换成对象    agr2=》true （query为对象格式）
    var pathName = urlObj.pathname //路径名（不包含参数的）

    var reg = /^\/api/
    if(pathName.match(reg)){ //如你 /api开头 =》转卖座

        //服务代理请求
        http.get("http://aura.maizuo.com"+req.url,function(response){
            //response 卖座的响应
            var data = ""
            //卖座返回给你的数据
            response.on("data",function(chuck){
                data+=chuck
            })
            //卖座 的数据接收完成
            response.on("end",function(){
                console.log(data)
                res.write(data) //把卖座的数据给自己的前端
                res.end()
            })
        })
       

    }



    //统一配置 html，和图片的  路由判断配置
    if(pathName=="/"){
        files.readFile("./views/index.html",res)
    }else if(pathName.search(".html")!=-1){
        //  /list.html
        //用户想要html文件
        files.readFile("./views"+pathName,res)
    }else if(pathName.search("/images")!=-1){
        //用户想要images文件
        files.readFile("."+pathName,res)
    }
    
  
}).listen(80)
console.log("server run at http://localhost:8060")