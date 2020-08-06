var counter = 0;

var express = require('express');
var app = express();
var server = app.listen(3000); //Start server on localhost:3000
// var server = require('http').createServer(app);

app.use(express.static('public')); //Give the contents of the public folder to the client as static files.

//Eventually, I want to support rooms to keep players in different campaigns at the same time seperate

console.log("Server is running on port 3000");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  socket.id = "user_" + counter++;
  console.log("New Connection: " + socket.id);

  socket.on('button', buttonPressed);
  function buttonPressed(message) {
    console.log(socket.id + " " + message);
  }

  socket.on('data-request', returnRequestedData);
  function returnRequestedData(dataReq) {
    console.log("recieved data request of type: " + dataReq.type);
    data = require(dataReq.src);
    console.log("returning data: " + data);
    var dataRet = {
      data: data,
      type: dataReq.type
    }
    socket.emit('data-return', dataRet);
  }

  socket.on('username-check', checkUsername);
  function checkUsername(name) {
    var usernames = require('./assets/data/users.json');
    for (var i in usernames) {
      if (name === usernames[i].username) {
        socket.emit('username-result', true);
        return;
      }
    }
    socket.emit('username-result', false);
  }
}
