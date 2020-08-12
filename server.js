const express = require('express');
const app = express();
const server = app.listen(3000); //Start server on localhost:3000
// var server = require('http').createServer(app);
var localStorage;
var utils = require('./server-utils');

app.use(express.static(__dirname + '/public')); //Give the contents of the public folder to the client as static files.

//Handle Get requests:
app.get('/test', (req, res) => {
  var msg = {
    message: "GET Tested"
  }
  res.json(msg);
  console.log("Get Request: " + req.url);
});

console.log("Server is running on port 3000");

var socket = require('socket.io');
var io = socket(server);

const crypto = require('crypto');

io.sockets.on('connection', newConnection);
function newConnection(socket) {
  var users = require('./data/users.json');

  setupLocalStorage(socket);
  if (localStorage.logged_in) { //If another computer logged into your account while you were gone.
    for (var i in users) {
      if (users[i].username === localStorage.username && users[i].active) {
        localStorage.logged_in = false;
        localStorage.removeItem('username');
      }
    }
  }

  console.log("New Connection: " + socket.id);
  assignRoom(socket, 'signing-in');

  socket.on('username-check', checkUsername);
  function checkUsername(name) {
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
    localStorage.logged_in = false;
    // localStorage.setItem('logged-in', false);
    var message = "Could not find account.";

    for (var i in users) {
      if (login.username === users[i].username) {
        if (!users[i].active) {

          var hash = crypto.createHash('sha1').update(login.password).digest('hex');
          if (hash === users[i].password) {
            localStorage.username = users[i].username;
            // localStorage.setItem('username', users[i].username);
            users[i].active = true;
            message = "Log in successful.";
            localStorage.logged_in = true;
            // localStorage.setItem('logged-in', true);
          }
        } else {
          message = "Account is already active.";
        }
      }
    }

    var credentials = {
      loginSuccessful: localStorage.logged_in,
      username: localStorage.username,
      message: message
    }
    console.log(credentials);
    socket.emit('login-validation', credentials);
  }

  socket.on('log-out', logOut);
  function logOut() {
    for (var i in users) {
      if (users[i].username === localStorage.username) {
        users[i].active = false;
      }
    }

    localStorage.removeItem('username');
    localStorage.logged_in = false;
  }

  //return to this when working on storing active user in users.json

  socket.on('disconnect', (reason) => {
    console.log(reason);
    if (reason === 'io server disconnect' || reason === 'transport close') {
      // socket.connect(); //Maybe emit to socket and have client reconnect
    } else if (localStorage.logged_in === 'true') {
      for (var i in users) {
        if (users[i].username === localStorage.username) {
          users[i].active = false;
        }
      }
    }
  });
}

function assignRoom(socket, room) {
  if(socket.room) {
    socket.leave(socket.room);
  }
    socket.room = room;
    socket.join(room);
}

function setupLocalStorage(socket) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch.log');
  } else { //localStorage setup on return
    if (localStorage.logged_in === 'true') {
      var username = localStorage.username;
      console.log("Returning User " + username);
      socket.emit('login-validation', {loginSuccessful: true, username: username});
    }
  }
}
