const express = require('express');
const app = express();
const server = app.listen(3000); //Start server on localhost:3000
// var server = require('http').createServer(app);

app.use(express.static(__dirname + '/public')); //Give the contents of the public folder to the client as static files.

//Handle Get requests:

console.log("Server is running on port 3000");

var socket = require('socket.io');
var io = socket(server);

const crypto = require('crypto');

io.sockets.on('connection', newConnection);
function newConnection(socket) {
  console.log("New Connection: " + socket.id);

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
    var users = require('./assets/data/users.json');
    for (var i in users) {
      if (name === users[i].username) {
        socket.emit('username-result', true);
        return;
      }
    }
    socket.emit('username-result', false);
  }

  socket.on('login-attempt', validateLogin);
  function validateLogin(login) {
    var loginSuccessful = false;

    var users = require('./assets/data/users.json');
    for (var i in users) {
      if (login.username === users[i].username) {
        var hash = crypto.createHash('sha1').update(login.password).digest('hex');
        if (hash === users[i].password) {
          socket.id = users[i].username;
          loginSuccessful = true;
        }
      }
    }

    var credentials = {
      loginSuccessful: loginSuccessful,
      username: socket.id
    }
    console.log(credentials);
    socket.emit('login-validation', credentials);
  }
}
