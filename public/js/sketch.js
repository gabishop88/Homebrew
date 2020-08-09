var socket;
var campaign_data;
var misc_data;
var alerts = [];

function setup() {
  socket = io.connect('https://08b03a63b6fb.ngrok.io'); //Connect here when I use ngrok
  // socket = io.connect('localhost:3000');  //Connect here as a backup. This shuold be temporary.

  socket.on('data-return', saveData);
  socket.on('username-result', allowLogin);
  socket.on('login-validation', completeSignIn);

  console.log("Hello! Welcome to the Homebrew");
  randomizeLoginBars();
  var usernameBox = document.getElementById('username');
  usernameBox.addEventListener('input', checkUsername);

  requestData("./data/campaigns/example-campaign.json", "campaign");
  console.log(document.getElementById('login-bars').classList);
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
      break;
    default:
      misc_data = data.data;
  }
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
  var signInButton = document.getElementById("sign-in");
  if (usernameMatch) {
    signInButton.setAttribute("value", "Log In");
    signInButton.setAttribute("onclick", "logIn()");
  } else {
    signInButton.setAttribute("value", "Sign Up");
    signInButton.setAttribute("onclick", "signUp()");
  }
}

function signUp() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  console.log(username + ' ' + password);
  if (username === "" || password === "") {
    alert("Please enter a username and password");
  }

  console.log("Create New Account");
}

function logIn() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username === "" || password === "") {
    alert("Please enter a password");
  } else {
    var login = {
      username: username,
      password: password
    }
    socket.emit('login-attempt', login);
  }
}

function completeSignIn(credentials) {
  var username = document.getElementById("username").value;
  if (credentials.loginSuccessful && credentials.username === username) {
    alert("Login Successful, welcome " + credentials.username);
    var logInBars = document.getElementById('login-bars');
    var logOut = document.getElementById('log-out');
    logInBars.classList.add('hide-left');
    logOut.classList.remove('hide-left');
    logOut.classList.add('left-bar');
  } else {
    alert("Incorrect Password");
  }
}

function logOut() {
  console.log("Logging Out");
}

function alert(msg) {
  alerts.push(msg);
  var alertBox = document.getElementById('alert-box');
  postNextAlert();

  function postNextAlert() {
    alertBox.innerHTML = alerts.shift();
    window.setTimeout(() => {
      alertBox.innerHTML = "";
      if (alerts.length > 0) {
        postNextAlert();
      }
    }, 1000);
  }
}
