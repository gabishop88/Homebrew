var socket;
var campaign_data;
var misc_data;
var alerts = [];
var gradientSpeed = 1;
var gradHue = 0;
var gradGap = 40;

function setup() {
  //connect socket to server.
  socket = io.connect('https://08b03a63b6fb.ngrok.io'); //Connect here when I use ngrok
  // socket = io.connect('localhost:3000');  //When I am not using an https tunnel

  // Set up socket responses
  socket.on('username-result', allowLogin);
  socket.on('login-validation', completeSignIn);

  //Page setup
  console.log("Hello! Welcome to the Homebrew");
  randomizeBarLengths();
  var usernameBox = document.getElementById('username');
  usernameBox.addEventListener('input', checkUsername); //'input' is triggered when usernameBox.value changes.
  playAnimation(document.getElementById('login-bars'), 'anim-slide-on');

  fetch('test')
    .then((response) => {
      response.json().then(function(data) {
        console.log(data);
      });
    });
}

function draw() {
  var grad = 'background-image: linear-gradient(to top right, hsl(' + gradHue + ', 30%, 25%), hsl(' + ((gradHue + gradGap) % 360) + ', 30%, 25%));';
  gradHue = parseInt(gradHue, 10) + gradientSpeed;
  if (gradHue >= 360) {
    gradHue = 0;
  }
  document.body.setAttribute('style', grad);
  // document.body.style.backgoundImage = 'linear-gradient(to-top-right, red, blue)';
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
  if (credentials.loginSuccessful) {
    alert("Login Successful, welcome " + credentials.username);
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    playAnimation(document.getElementById('login-bars'), 'anim-slide-off');
    window.setTimeout(() => {
      displayElement(document.getElementById('login-bars'), false);
      playAnimation(document.getElementById('log-out'), 'anim-slide-on');
    }, 1000);
  } else {
    alert("Incorrect Password");
  }
}

function logOut() {
  console.log("Logging Out");
  socket.emit('log-out');
  playAnimation(document.getElementById('log-out'), 'anim-slide-off');
  window.setTimeout(() => {
    randomizeBarLengths();
    displayElement(document.getElementById('log-out'), false);
    playAnimation(document.getElementById('login-bars'), 'anim-slide-on');
  }, 1000);
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

function playAnimation(element, animClass) {
  displayElement(element, true);
  for (var i = 0; i < element.classList.length; i++) {
    if (element.classList[i].substring(0, 4) === 'anim') {
      element.classList.remove(element.classList[i]);
    }
  }
  void element.offsetWidth;
  element.classList.add(animClass);
}

function displayElement(element, display) {
  if (display) {
    element.classList.remove('no-display');
  } else {
    element.classList.add('no-display');
  }
}
