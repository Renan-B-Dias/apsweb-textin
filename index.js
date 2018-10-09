require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const logger = require('morgan');
var path = require('path');

// App setup
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(8080, function() {
	console.log("Listening to request on 8080");
});

const shouldPrintDebug = process.env.ENVIROMENT == 'development';

// Static files
app.use(logger('dev'));

// Socket setup
const io = socket(server);

io.on('connection', socket => {
	socket.on('room', routePath => {
		if(shouldPrintDebug) console.log("Did enter room: " + routePath);
		socket.join(routePath);
	});

	socket.on('chat', function(data) {
		const path = data.pathName;
		if(shouldPrintDebug) console.log("User " + data.userName + " did send message");
		socket.to(path).emit('chat', data)
	});

	socket.on('typing', function(data) {
		const path = data.pathName;
		if(shouldPrintDebug) console.log("User " + data.userName + " is typing");
		socket.to(path).broadcast.emit('typing', data);
	});

	// socket.on('clearFeedback', path => {
	// 	socket.to(path).broadcast.emit('clearFeedback');
	// });
});

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('*', function(req, res){
  res.render('chat');
});