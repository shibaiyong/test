var http = require('http')
var url  =require("url")
var querystring = require("querystring")

var files = require("./files")
http.createServer(function(req,res){
    if(req.url=="/favicon.ico") return 
    var urlObj = url.parse(req.url,true) //把url、转换成对象    agr2=》true （query为对象格式）
    var pathName = urlObj.pathname //路径名（不包含参数的）

     //api 的内容
     if(pathName=="/api/getGoods"){
         //你要获取商品数据
        var Product =  require("./models/products")
        var myPro = new Product()
        var proData =JSON.stringify(myPro.getProList())//商品数据

        //get方式的接口
        // res.write(proData)
     
        //设计jsonp的接口
        var callbackName = urlObj.query.callback//获取回调函数的名
        console.log(urlObj)
        res.write(callbackName+"("+[1,2,3]+")") //拼接 json数据和函数调用 （函数内嵌json）=》json with padding

        res.end()
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