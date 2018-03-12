var http = require('http')
var url  =require("url")
var querystring = require("querystring")

var files = require("./files")
http.createServer(function(req,res){
    if(req.url=="/favicon.ico") return 

    var myUrl = req.url
    
    var urlObj = url.parse(myUrl,true) //把url、转换成对象    agr2=》true （query为对象格式）
    console.log(urlObj) 
    var pathName = urlObj.pathname //路径名（不包含参数的）
    if(pathName=="/login.html"){
        //如果是登录页面
        //get的 参数
         console.log(urlObj.query.username) 
         console.log(urlObj.query.password) 

         //post 的参数
         var postStr = ''
         req.on("data",function(chuck){ //当前端给你用post方式传参的时候
             postStr+=chuck
         })
         req.on("end",function(){//当前端给你用post方式传参结束的时候
             console.log(querystring.parse(postStr))
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