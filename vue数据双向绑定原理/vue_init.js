//静态属性  和  实例属性  是有区别的
//第一点

//静态属性 直接通过 构造函数访问  不需要new 出一个实例对象
//实例属性 需要new关键字，通过实例对象访问

//第二点

//
function Vue(){
  this.data = {
    a:1
  }
}

function initGlobalMemeber( Vue ){

  const configDef = {
    get:()=>'aaa',
    set:()=>console.warn('不能赋值')
  };

  Vue.globalB = 'globalB';
  Object.defineProperty(Vue,"config",configDef);
}

initGlobalMemeber(Vue)

Vue.prototype._Name = 'prototypeName';

Vue.use = function (){
  //这里验证了this的指向问题，谁调用的函数this指向谁。此处的this指向Vue
  console.log('thisthis ',this)
  console.log(this.globalB)
  return this
}
Vue.use()

console.log(Vue.config)
console.log(new Vue())
Vue.config = 'bb'

//原生dom拼接字符串
var dom = document.getElementsByClassName('specify')[0];
dom.innerHTML = "<span onclick=cli(" + "\"val\"" + ")>点击</span>";
function cli(val) {
  console.log(val)
}

