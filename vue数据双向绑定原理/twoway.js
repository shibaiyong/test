function observe (obj, vm) {
  Object.keys(obj).forEach(function (key) {
    defineReactive(vm, key, obj[key]);
  })
}
function defineReactive (obj, key, val) {
  var dep = new Dep();
  Object.defineProperty(obj, key, {
    get: function () {
      // 添加订阅者 watcher 到主题对象 Dep

      if (Dep.target) {
				dep.addSub(Dep.target)
			}
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      val = newVal;
      // 作为发布者发出通知
      dep.notify();
    }
  });
}
function Dep () {
  this.subs = []
}
Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub);
  },
  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
}
function nodeToFragment (node, vm) {
  var flag = document.createDocumentFragment();
  var child;
  // 许多同学反应看不懂这一段，这里有必要解释一下
  // 首先，所有表达式必然会返回一个值，赋值表达式亦不例外
  // 理解了上面这一点，就能理解 while (child = node.firstChild) 这种用法
  // 其次，appendChild 方法有个隐蔽的地方，就是调用以后 child 会从原来 DOM 中移除
  // 所以，第二次循环时，node.firstChild 已经不再是之前的第一个子元素了
  while (child = node.firstChild) {
    compile(child, vm);
    flag.appendChild(child); // 将子节点劫持到文档片段中
  }
  return flag
}
function compile (node, vm) {
	if(!node){
		return false;
	}
  var reg = /\{\{(.*)\}\}/;
	
  // 节点类型为元素
  if (node.nodeType === 1) {
		compile(node.firstChild,vm)
    //获取到的是属性节点 类型是map
    var attr = node.attributes;
    // 解析属性
    for (var i = 0; i < attr.length; i++) {
      if (attr[i].nodeName == 'v-model') {
        var name = attr[i].nodeValue; // 获取 v-model 绑定的属性名
        node.addEventListener('input', function (e) {
          // 给相应的 data 属性赋值，进而触发该属性的 set 方法
          vm[name] = e.target.value;
        });
				//node.removeAttribute('v-model');
        // node.value = vm[name]; // 将 data 的值赋给该 node
        //这就是页面的监器，也叫订阅者。数据改变时会通知到页面执行响应的watcher逻辑
        new Watcher(vm, node, name, 'input');
      }
    };
    
  }
  // 节点类型为 text
  if (node.nodeType === 3) {
    if (reg.test(node.nodeValue)) {
      var name = RegExp.$1; // 获取匹配到的字符串
      name = name.trim();
      //这就是页面的监器，也叫订阅者。数据改变时会通知到页面执行响应的watcher逻辑
      new Watcher(vm, node, name, 'text');
    }
  }
}
//这就是页面的监器，也叫订阅者。数据改变时会通知到页面执行响应的watcher逻辑。
//此外，还有一种计算属性computed的Watcher。它也是由data数据来驱动执行的。

//这里是不是这样更好，就是每一个data中的数据都有一个Dep这样的watcher收集器。然后把所有的Dep数据器根据key值统一存储到一个对象中。

//computed的Watcher监听对象的由来：1、缓存机制实现的需要，实际上watcher对象是一种代理模式的实现。因为，computed的属性值，不是直接根据依赖数据计算出来的，中间经过了watcher这层代理的加工处理，最终才会得到结果。
//computed的Watcher监听对象生成的时机：1、这得看vue源码，他是在vue  initeState的时候生成的。这个不重要，主要是看computed实现的思路。

//data中被computed依赖的数据收集两种Watcher的时机：这是最核心的逻辑。其实就是在编译template模板的时候，此时会访问到computed属性，接着就会触发computed的get函数(这个时候页面的watcher和computed的watcher已经生成好了)，再触发data的get函数并收集前面提到的两个依赖。

function Watcher (vm, node, name, nodeType) {
  Dep.target = this;
  this.name = name;
  this.node = node;
  this.vm = vm;
  this.nodeType = nodeType;
  this.update();
  Dep.target = null;
}
Watcher.prototype = {
  update: function () {
    this.get();
    if (this.nodeType == 'text') {
      this.node.nodeValue = this.value;
    }
    if (this.nodeType == 'input') {
      this.node.value = this.value;
    }
  },
  // 获取 data 中的属性值
  get: function () {
    this.value = this.vm[this.name]; // 触发相应属性的 get
  }
}

function Vue (options) {
  this.data = options.data;
  var data = this.data;
  observe(data, this);
  var id = options.el;
  var dom = nodeToFragment(document.getElementById(id), this);
  // 编译完成后，将 dom 返回到 app 中
  document.getElementById(id).appendChild(dom);
}
var vm = new Vue({
  el: 'app',
  data: {
    text: 'hello world',
		one:'one',
		two:'two3243'
  }
})