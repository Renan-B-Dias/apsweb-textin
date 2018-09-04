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
	socket.on('room', routePath => {
		console.log("Did enter " + routePath);
		socket.join(routePath);
	});

	socket.on('chat', function(data) {
		const path = data.pathName;
		console.log("Did send on chat " + path);
		socket.to(path).emit('chat', data)
	});

	socket.on('typing', function(data) {
		const path = data.pathName;	
		socket.to(path).broadcast.emit('typing', data);
	});
});

app.use('*', function(request, response) {
	response.render('chat.html');
});
