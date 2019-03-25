
var qs= require('querystring');
const http = require('http');
const https = require('https');
const url = require('url');
const html = require('./html.js');
let dataRouter = {
    dataProcess(req,pathname,res){
        let urlInfo = url.parse(req.url,true,true);
        let pathPrev = pathname.split('/');
        let pName= pathPrev[pathPrev.length-1];
        let method = req.method;
        if(pName=='login'&&method.toLowerCase()=='post'){
            this.login(req,pathname,res)
        }
        else if(pathname == '/data/weather/city'){
            var data = qs.stringify(urlInfo.query);
            console.log(data);
            this.getCityWeather(data,res);    
        }
        else if(pathname == '/data/weather/citylist'){
            this.getCityList(data,res)
        }
    },
    login(req,pathname,res){
        var postData=''
        req.on("data", function (data) {
            postData += data;
        });
        req.on("end", function () {
            var query = qs.parse(postData);
            if(!(query.username&&query.password)){
                res.writeHead(400,{'Content-Type':'application/json'})
                res.end('false')
            }else{
                res.writeHead(200,{'Content-Type':'application/json'})
                res.end('true')   
            }
        });    
    },
    getCityWeather(data,res){
        //https://www.sojson.com/blog/305.html
        
        //免费天气借口
        var options={
            hostname: 't.weather.sojson.com', 
            path:'/api/weather/city/101030100',
            method: 'GET',
        }
        this.requestMthod(options,res)
    },
    getCityList(data,res){
        var options={
            hostname:'api.yytianqi.com',
            path:'/citylist/id/1',
            method: 'GET'
        }
        this.requestMthod(options,res)
    },
    requestMthod(options,respones){
        var alldata = ''; 
        var city=options.data;
        if(!city){
            city='';
        }
        var req = http.request({
            host:options.hostname,
            path:options.path + city,
            method:options.method
        }, function (res) { 
            res.on('data', function (chunk) { 
                alldata += chunk; 
            });
            res.on('end',()=>{
                respones.writeHead(200,{'Content-Type':'application/json'})
                respones.end(alldata);
            })
        }); 
           
        req.on('error', function (e) { 
            console.log('problem with request: ' + e.message); 
        }); 
          
        req.end();
    },
    requestMthods(options,respones){
        var alldata = ''; 
        var city=options.data;
        var req = https.request({
            host:options.hostname,
            path:options.path+city,
            method:options.method
        }, function (res) { 
            res.on('data', function (chunk) { 
                alldata += chunk; 
            });
            res.on('end',()=>{
                respones.writeHead(200,{'Content-Type':'application/json'})
                respones.end(alldata);
            })
        }); 
           
        req.on('error', function (e) { 
            console.log('problem with request: ' + e.message); 
        }); 
          
        req.end();
    }
}



module.exports=dataRouter