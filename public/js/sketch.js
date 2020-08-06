var socket;
var campaign_data;
var misc_data;

var p;

function setup() {
  socket = io.connect('https://homebrew.serverless.social/'); //Connect here when I use the lt
  // socket = io.connect('localhost:3000');  //Connect here as a backup. This shuold be temporary.
  socket.on('data-return', saveData);
  socket.on('username-result', allowLogin);

  console.log("Hello! Welcome to the Homebrew");
  randomizeLoginBars();
  var usernameBox = document.getElementById('username');
  usernameBox.addEventListener('input', checkUsername);

  p = document.getElementById('test-json'); // For testing

  requestData("./assets/data/campaigns/example-campaign.json", "campaign");
}

function requestData(src, type) {
  var dataReq = {
    src: src,
    type: type
  }
  socket.emit('data-request', dataReq);
}

function saveData(data) {
  switch (data.type) {
    case "campaign":
      campaign_data = data.data;
      p.innerHTML = campaign_data.owner;
      break;
    default:
      misc_data = data.data;
  }
}

function logButton() {
  var data = "Pressed the button";
  socket.emit('button', data);
}

function randomizeLoginBars() {
  var margin = random(20, 65);
  var bar;

  bar = document.getElementById("title-bar");
  bar.setAttribute("style", "margin-right: " + margin + "%;");

  margin = random(40, 60);
  bar = document.getElementById("username-bar");
  bar.setAttribute("style", "margin-right: " + margin + "%;");

  margin = random(40, 60);
  bar = document.getElementById("password-bar");
  bar.setAttribute("style", "margin-right: " + margin + "%;");

  margin = random(40, 60);
  bar = document.getElementById("submit-bar");
  bar.setAttribute("style", "margin-right: " + margin + "%;");
}

function showPassword() {
  var pass = document.getElementById("password");
  if (pass.type === "password") {
    pass.type = "text";
  } else {
    pass.type = "password";
  }
  toggleButton("show-pass");
}

function toggleButton(id) {
  var buttonClasses = document.getElementById(id).classList;
  if (buttonClasses.contains("checked")) {
    buttonClasses.remove("checked");
  } else {
    buttonClasses.add("checked");
  }
}

function checkUsername(update) {
  socket.emit('username-check', update.target.value);
}

function allowLogin(usernameMatch) {
  var logInButton = document.getElementById("log-in");
  if (usernameMatch) {
    logInButton.setAttribute("style", "");
  } else {
    logInButton.setAttribute("style", "display: none;");
  }
}

function signUp() {
  document
  console.log("Create New Account");
}

function logIn() {
  console.log("Log into existing Account");
}
