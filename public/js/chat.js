// Make connection on client (front end)
const socket = io.connect('https://dry-coast-50235.herokuapp.com');

// Query DOM
const message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      button = document.getElementById('send'),
      feedback = document.getElementById('feedback'),
      output = document.getElementById('output');

// Emit event
button.addEventListener('click', function() {
	console.log("HERE!!!!");
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
  message.value = "";
});

message.addEventListener('keypress', function() {
  socket.emit('typing', handle.value);
});

// Listen to events
socket.on('chat', function(data) {
  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>'
});

socket.on('typing', function(data) {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});