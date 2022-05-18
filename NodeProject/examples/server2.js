//  web-based:

//  create module
var http= require("http");

//  create server:

http.createServer(function(request,response){

{
    response.writeHead(200,{'content-type':'text/plain'});
}

response.end('Hello World \n');
response.end(' This server is running at port nnumber-8000 \n');
}).listen(8000);

console.log('Server running at port 8000 (http://127.0.0.1:8000/)');

