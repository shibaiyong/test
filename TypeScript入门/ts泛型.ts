
function identity<T,U>(value:T, message:U) : [T, U] {
  return [value,message]
}

var result = identity<Number,string>(2,'33');

console.log(result);

//1、在接口中定义泛型

interface Search<T,Y>{
  (name:T,age:Y):T
}

let fn:Search<string,Number> = function<T, Y>(name:T,age:Y){
  console.log(name,age)
  return name
}
//2、类中定义泛型
interface SearchClass<Y,Z>{
  foo(name:Y,age:Z):Y
}
//要在类中实现的接口，应该声明一个带有函数成员类型的接口
//同时类的类型变量的个数要和接口的类型变量的个数一样
class IdentityClass<T,U> implements SearchClass<T,U>{
  value:T
  constructor(value:T){
    this.value = value
  }
  getIdentity(): T{
    return this.value
  }
  foo(){
    return this.value
  }
}

//3、泛型约束

interface Length {
  length:number,
  name1:string
}

interface Length1{
  length:number,
  name1:string,
  name2:string
}

function test<T extends Length, U>(val:T):U{
  let params:boolean = false
  if(val.length){
    params = true
  }
  return params as U
}

let obj = {
  length: 1,
  name1:'hihih',
  name2:'hihih'
}

console.log(test<Length1,string>(obj))
console.log(test(obj))                    //出入的参数只要包含Length中的属性。

//4 keyof 使用方法

enum Difficulty {
  Easy,
  Intermediate,
  Hard
}

function getProperty<T,K extends keyof T>(obj:T,key:K){
  return obj[key]
}

let tsInfo = {
  name: "Typescript",
  supersetOf: "Javascript",
  difficulty: Difficulty.Intermediate
}

console.log(Difficulty.Intermediate) //返回枚举对象的下标
console.log(getProperty(tsInfo,'name'))

let difficulty:Difficulty = getProperty(tsInfo,'difficulty')

console.log(difficulty) //返回枚举对象的下标

//5、inter关键字使用

type ReturnMyType<T> = T extends (...args:any[]) => infer R ? R : any;

type PromiseMyResType<T> = T extends Promise<infer R> ? R : T;
 
interface Person {
  name:string,
  age: number
}

async function personPromise(){
  return {name:'p',age:12} as Person
}

type PromisePerson = ReturnMyType<typeof personPromise>

//反解
type PromisePersonStr = PromiseMyResType<PromisePerson>


type Blank = ' ' | '\n' | '\t';
type MyTrimLeft<S extends string> = S extends `${Blank}${infer R}` ? MyTrimLeft<R> : S;

type Trim = MyTrimLeft<' aaa'>;

//元组
type TupleDemo = [string,number];

let stringNumberTuple:TupleDemo = ['1',1];

type ElementOf<T> = T extends Array<infer R> ? R : never;

type ToUnion = ElementOf<TupleDemo>;
