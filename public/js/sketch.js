var socket;

function setup() {
  socket = io.connect('https://homebrew.serverless.social/');
  createCanvas(400, 400);
  background(51);

  console.log("Hello! Welcome to the Homebrew");

  var p = document.getElementById('test-json'); // For testing
}

function draw() {
}

function logButton() {
  var data = "Pressed the button";
  socket.emit('button', data);
}
