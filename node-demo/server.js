const http = require('http');


const router = require('./router')

const host = '127.0.0.1';

const port = '1235'

const server = http.createServer((req,res)=>{
    router.classifyProcess(req,res);
})

server.listen(port,()=>{
    console.log(`server is running at http://${host}:${port}`)
})

