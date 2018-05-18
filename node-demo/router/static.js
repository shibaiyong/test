const fs = require('fs');
const mime = require('mime')
let staticRouter = {
     
    foundFile(pathname,res){ 
        this.readAndWrite('.'+pathname,res)
    },
    readAndWrite(pathname,res){
        fs.readFile(pathname,(err,data)=>{
            res.writeHead(200,{'Content-Type':mime.getType(pathname)})
            res.end(data);
        })
    }
}

module.exports=staticRouter