const fs = require('fs');
let htmlRouter = {
    
    notFound(){

    },
    foundHtml(pathname,res){
        this.readAndWrite('./views/login.html',res)
    },
    readAndWrite(pathname,res){
        if(/^\./.test(pathname)){
            var pathname = pathname;
        }else{
            pathname = '.'+pathname;
        }
        fs.readFile(pathname,(err,data)=>{
            res.writeHead(200,{'Content-Type':'text/html'})
            res.end(data);
        })
        
    }
}

module.exports=htmlRouter