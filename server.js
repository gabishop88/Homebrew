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
  console.log("New Connection: " + socket.id);
  console.log("Attempting to set id to 'user_n'");
  socket.id = "user_" + counter;
  counter++;
  console.log(socket.id + " is connected to the server.");

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
}
