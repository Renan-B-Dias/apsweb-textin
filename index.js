require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const logger = require('morgan');

const ChatsController = require('./controllers/ChatsController');

const redis = require('redis');
const redisClient = redis.createClient();

// Flush DB
// redisClient.flushdb( function (err, succeeded) {
//   console.log(succeeded); // will be true if successfull
// });

// App setup
const app = express();

const server = app.listen(8080, function() {
	console.log("Listening to request on 8080");
});

const shouldPrintDebug = process.env.ENVIROMENT == 'development';

// Static files
app.use(express.static('public'));
app.use(logger('dev'));

app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

// Test
const util = require('util')
// console.log(util.inspect(myObject, {showHidden: false, depth: null}))

// Socket setup
const io = socket(server);
io.on('connection', socket => {
	socket.on('room', routePath => {
		if(shouldPrintDebug) console.log("Did enter room: " + routePath);

    redisClient.get(routePath, function(error, result) {
      if(error) {
        console.log(error);
      }

      if(result) {
        socket.join(routePath);
        const chatMessages = JSON.parse(result);

        socket.emit('chatMessages', chatMessages);
      }
    });
	});

	socket.on('chat', function(data) {
		const path = data.pathName;
		if(shouldPrintDebug) console.log("User " + data.userName + " did send message");

    redisClient.get(data.pathName, function(error, result) {
      if(error) {
        console.log(error);
      }

      let chatMessages = JSON.parse(result);
      if(chatMessages) {
        chatMessages.push({
          'userName': data.userName,
          'message': data.message
        });
      } else {
        chatMessages = [{ 'userName': data.userName, 'message': data.message }]
      }

      redisClient.set(data.pathName, JSON.stringify(chatMessages));

      socket.to(path).emit('chat', data);
    });
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

// Redis
redisClient.on('connect', function() {
  console.log('Redis client connected');
});

redisClient.on('error', function(error) {
  console.log('Something went wrong ' + error);
});

// Routes
app.use('*', ChatsController.index);
