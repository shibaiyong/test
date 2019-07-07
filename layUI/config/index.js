/**
  项目JS主入口
  以依赖layui的layer和form模块为例
**/    
layui.define(['layer', 'form'], function(exports){
  var layer = layui.layer
  layer.msg('Hello World')
  exports('index', function(){
    alert('ahahahhaha')
  });
}); 