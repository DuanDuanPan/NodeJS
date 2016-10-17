var net = require('net');

// var server = net.createServer(function(socket) {
// 	socket.on('data', function(data) {
// 		socket.write(data);
// 	});
// });

var server = net.createServer(function(socket) {
	socket.once('data', function(data) {
		socket.write(data);
	});
});

server.listen(8888);