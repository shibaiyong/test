var express = require('express');
var router = express.Router();

//商品的数据模块
var Product = require("../models/product")
var myPro = new Product();


//user的数据模块
var User = require("../models/user")
var myUser = new User();

/* GET home page. */

// v-html
// ng-bind-html

router.get('/', function(req, res, next) {
    console.log(req.session)
  //等获取到数据以后再渲染页面
  myPro.getProList(function (results) {
      //console.log(results);

      var data = {
          isLogin:false,
          title: 'hello',
          username:'',
          proListData:results ,
          htmlstr:'<a href="###"> link</a>'
      };

      if(req.session.user){
            //有用户信息，登录了
          data.isLogin=true ;//改变登录状态
          data.username = req.session.user.username //获取用户名
      }
      res.render('index', data );
  });
    //需要商品的数据
});


//登录get
router.get("/login",function (req,res,next) {
    console.log("登录get");
    console.log(req.query);
    res.render('login', {title:"登录",msg:''});
});



//登录post提交数据
router.post("/login",function (req,res,next) {
    console.log("登录post");
    console.log(req.body);//登录参数 =》和数据库对比
    //req.body  (post参数)
    myUser.login(req,function (msg) {
        console.log(msg)
        res.render('login', {title:"登录",msg:msg});
    }); //让登录模块去检查  用户名和密码


});







//注册get
router.get("/reg",function (req,res,next) {
    res.render('reg', {title:"注册",msg:''});
});

//注册post数据提交
router.post("/reg",function (req,res,next) {
   
    myUser.reg(req.body,function (msg) {
        //msg ：注册结果
        res.render('reg', {title:"注册",msg:msg});
    })
});

module.exports = router;
