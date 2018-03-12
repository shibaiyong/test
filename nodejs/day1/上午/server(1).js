var http = require("http")  //node自带的模块
var proModule = require("./products") //加载商品模块
var myPro = new proModule() 
var fs = require("fs")


http.createServer(function(request,response){
  //request 请求 =》req
  //response 响应 =》res
  console.log(request.url)
  if(request.url=="/index.html"){
    fs.readFile("./index.html",function(err,data){
      //err 后端程序里，第一个形参基本都是err
      if(err) {
        throw err;
      }else{
        //data 是你读取的页面
        //responseindex.html页面
        response.write(data)//输出需要是字符串
        response.end() //响应完了以后需要结束
      }
    })  
  } else if(request.url=="/write"){
    //写入内容
    fs.writeFile('./text/2.txt','2222222',function(err){
      console.log(err)
      if(!err){
        response.write("ccc")
        response.end()
      }else{
        response.write("aaaaa")
        response.end()
        throw err;
      }
    })
  }else{
    var proListData = myPro.getProList() //获取商品数据
    response.write(JSON.stringify(proListData)) //输出需要是字符串
    response.end() //响应完了以后需要结束
    //response.write("hello end") //结束以后就不能再输出了
  }
    
}).listen(8060)

console.log("server run at http://localhost:8060")
// 用js实现后端的功能


