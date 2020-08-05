var express = require('express');
var app = express();
var server = app.listen(3000); //Start server on localhost:3000
// var server = require('http').createServer(app);

app.use(express.static('public')); //Give the contents of the public folder to the client as static files.


console.log("Server is running on port 3000");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log("New Connection: " + socket.id);

  socket.on('button', buttonPressed);
  function buttonPressed(message) {
    console.log(socket.id + " " + message);
  }
}
