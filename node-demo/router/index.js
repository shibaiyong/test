const data = require('./data.js')
const html = require('./html.js')
const static = require('./static.js')
const url = require('url');
let router={
    classifyProcess(req,res){
        let urlInfo = url.parse(req.url,true,true);
        var pathname = urlInfo.pathname;
        var path = pathname.split('/');
        console.log(urlInfo);
        if(pathname=='/'){
            html.foundHtml(pathname,res)
        }
        console.log(path[1])
        switch(path[1]){
            case 'static': static.foundFile(pathname,res);break;
            case 'data':    data.dataProcess(req,pathname,res);break;
            case 'views':   html.readAndWrite(pathname,res)
        }
    }
    
}
module.exports=router;