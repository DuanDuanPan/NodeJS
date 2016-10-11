var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};


// 全局函数
function sendNotFound(response) {
	response.writeHead(404, {
		'Content-Type': 'text/plain'
	});
	response.write('Error 404:resource not found');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(200, {
		'Content-Type': mime.lookup(path.basename(filePath))
	});
	response.end(fileContents);
}

function serverStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						sendNotFound(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, cache[absPath]);
					}
				});
			} else {
				sendNotFound(response);
			}
		});
	}
}

// 声明服务
var server = http.createServer(function(request,response){
	var filePath = false;
	if(request.url == '/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath;
	serverStatic(response,cache,absPath);
});

// 启动服务
server.listen(3000,function(){
	console.log('Server listening on port 3000.');
});


// 聊天模块
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

