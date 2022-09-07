var a = 11

setTimeout(()=>{
  a = 22
},3000)

export {a}

//export default a  等价于 export {a as default}
//因此default是一个设置别名的语法糖

//export 可以动态修改导出的值得原因：它导出的模块都是对象（引用类型的数据），
//而reuire（...）是一个赋值过程，因此对于简单类型的数据就不能动态更新