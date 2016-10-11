var http = require('http');
var fs = require('fs');
http.createServer(function(rep,res){
	res.writeHead(200, '{"Context-type":"img/png"}');
	fs.createReadStream('hello.png').pipe(res);
}).listen(3000);