var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = {};
var currentRoom = {};

exports.listen = function(server) {
	io = socketio.listen(server);
	io.set('log level', 1);
	io.sockets.on('connection', function(socket) {
		// 分配昵称
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
		// 加入默认聊天室
		joinRoom(socket, 'DuanDuan Chat');
		// 发送聊天消息
		handleMessageBroadcasting(socket, nickNames);
		// 修改昵称
		handleNameChangeAttempts(socket, nickNames, nameUsed);
		// 创建聊天室
		handleRoomJoining(socket);

		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		// 断开连接
		handleClientDisconnection(socket, nickNames, nameUsed);
	});
};

function assignGuestName(socket, guestNumber;, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	namesUsed.push(name);
	return guestNumber + 1;
}

function joinRoom(socket, room) {
	// 进入房间
	socket.join(room);
	// 绑定用户与当前房间
	currentRoom[socket.id] = room;
	// 通知其他用户 新用户加入房间
	socket.emit('joinResult', {
		room: room
	});
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + 'has joined' + room + '.'
	});

	// 确定当前房间中所有人数
	var usersInRoom = io.sockets.clients(room);

	if (usersInRoom.length > 1) {
		var userInRoomSummary = 'Users currently in ' + room + ' : ';
		for (var index in usersInRoom) {
			var userSocketId = userInRoom[index].id;
			if (userSocketId!socket.id) {
				if (index > 0) {
					userInRoomSummary += ', ';
				}
				userInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', {
			text: userInRoomSummary
		});
	}
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	// 添加更名事件
	socket.on('nameAttempt', function(name) {
		// 不能以Guest开始
		if (name.indexOf('Guest') == 0) {
			socket.emit('nameResult', {
				success: false,
				message: 'Name cannot begin with "Guest".'
			});
		} else {
			// 如果不存在
			if (namesUsed.indexOf(name) == -1) {
				// 以前的昵称
				var previousName = nickNames[socket.id];
				// 以前昵称下标
				var previousNameIndex = namesUsed.indexOf(previousName);
				// 存入新的昵称
				namesUsed.push(name);
				nickNames[socket.id] = name;
				//删除老的昵称
				delete namesUsed[previousNameIndex];
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.io]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	});
}

function handleMessageBroadcasting(socket, nickNames) {
	// 发送消息处理
	socket.on('message', function(message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text
		});
	});
}

function handleRoomJoining(socket){
	// 加入房间
	socket.on('join',function(room){
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket,room.newRoom);
	});
}

function handleClientDisconnection(socket, nickNames, namesUsed){
	// 断开连接
	socket.on('disconnect',function(){
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}