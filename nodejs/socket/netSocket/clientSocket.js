const net = require('net');

const port = 9000;

const host = '127.0.0.1';

//客户端创建socket

let client = new net.Socket();

 client.setEncoding = 'UTF-8';

client.connect(port,host,()=>{
  console.log('已经链接到服务器了')；
})
//服务端向客户端发送数据时。
client.on('data',(res)=>{
  console.log(res.toString());
  say()
})

//服务端关闭的时候会重新出发
client.on('close',(err)=>{
  console.log(err);
  console.log('server is close')
  
})
//使用node 自带模块实现与命令行的数据交互。通信
const readline = require('readline')

let r = readline.createInterface({
  input:process.stdin,
  output:process.stdout
})


let say = ()=>{
  r.question('please enter:',(inputstr)=>{
    client.write(inputstr+'\n')
  })
}