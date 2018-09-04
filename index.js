const express = require('express');
const socket = require('socket.io');
const logger = require('morgan');

// App setup
const app = express();

const server = app.listen(8080, function() {
	console.log("Listening to request on 8080");
});

// Static files
app.use(express.static('public'));
app.use(logger('dev'));

app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

// Socket setup
const io = socket(server);

io.on('connection', socket => {

});

// io.on('connection', function(socket) {
// 	console.log( 'User ' + socket.id + ' connected' );

// 	socket.on('chat', function(data) {
// 		console.log("Did send on chat");
// 		console.log(data);
// 		console.log(data.pathName);
// 		// io.sockets.in(data.)
// 		// io.sockets.emit('chat', data)

// 		io.sockets.in(data.pathName).emit('chat', data)

// 	});

// 	socket.on('typing', function(data) {
// 		console.log("Did send on typing");
// 		socket.broadcast.emit('typing', data);
// 	});
// });

app.use('*', function(request, response) {
	//
	// const ioof = io.of(request.originalUrl)
	// const room = request.originalUrl;

	// ioof.on('connection', function(socket) {
	// 	console.log('USER DID CONNECT TO ' + room);

	// 	socket.join(room);

	// 	socket.on('chat', function(data) {
	// 		console.log("ON CHAT");
	// 		io.sockets.in(room).emit('chat', data);
	// 	});

	// 	socket.on('typing', function(data) {
	// 		console.log("ON TYPING");
	// 		// io.sockets.in(room).broadcast.emit('typing', data);
	// 		socket.broadcast.emit('typing', data);
	// 	});
	// });
	response.render('chat.html');
});

// // iosa.on('connection', function(socket){  
// //     console.log('Connected to Stack Abuse namespace'):
// // });

