const net = require('net');

//创建服务
const server = net.createServer(); 

let clientObj = {};

let count = 0;

//当服务器被链接时，回掉函数接受客户端的信息

server.on('connection',(client)=>{
  client.name = ++count;
  clientObj[client.name] = client;
  console.log('新用户来了'+client.name);
  broading('我来了',client);
  //当当当前客户端发送过来数据的时候
  client.on('data',(data)=>{
    //console.log(client.name+'say:'+data);
    broading(data,client);
  })

  client.on('error',(err)=>{
    console.log('client error'+JSON.parse(err));
    client.end();
  })
})


server.listen(9000,'127.0.0.1',()=>{
  console.log('server is running at 127.0.0.1:9000')
});


function broading(message,client){
  for(var i in clientObj){
      clientObj[i].write(client.name+'say:'+message.toString());
  }
}