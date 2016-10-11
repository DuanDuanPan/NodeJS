var http = require('http');
var server = http.createServer();
server.on('request',function(req,res){
	res.writeHead(200, '{"Context-type":"text/plain"}');
	res.end('Hello Your Sister\n');
});
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');