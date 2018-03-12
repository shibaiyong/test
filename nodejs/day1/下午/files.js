
var fs = require("fs")
module.exports={
    readFile:function(url,res){
        fs.readFile(url,function(err,data){
            if(err) throw err
            res.write(data)
            res.end()
        })
    }
}