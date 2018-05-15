const http = require('http');
const url = require('url');

const host = '127.0.0.1';

const port = '1234'

const server = http.createServer((req,res)=>{

    
    let urlInfo = url.parse(req.url,true,true)
    console.log(urlInfo)
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    res.write('hello word');
    res.end();

})

server.listen(port,()=>{
    console.log(`server is running at http://${host}:${port}`)
})

