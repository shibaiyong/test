var express = require("express");
var mongo = require("mongoskin");
var app = express()

var db = mongo.db("mongodb://localhost:27017/my1709")
db.bind("mycol");
app.get("/",function (req,res) {

    db.mycol.find().toArray(function (err,results) {
        console.log(err)
        console.log(results)
        res.send(results)
    })
});

app.get("/add",function (req,res) {
    console.log(req.query) //直接把参数添加到数据库
    db.mycol.insert(req.query,function (err) {
        console.log(err)
        if(!err){
            res.send("添加成功")
        }

    })
});


app.listen(80)