var socket;
var campaign_data;
var misc_data;

var p;

function setup() {
  // socket = io.connect('https://homebrew.serverless.social/'); //Connect here when I use the lt
  socket = io.connect('localhost:3000');  //Connect here as a backup. This shuold be temporary.
  socket.on('data-return', saveData);

  console.log("Hello! Welcome to the Homebrew");
  randomizeLoginBars();

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
  var showPassword = document.getElementById("show-pass");
  var w = 100 - margin;
  showPassword.setAttribute("style", "max-width:" + w + "%;");
  console.log(w);
}

function showPassword() {
  var pass = document.getElementById("password");
  var buttonClasses = document.getElementById("show-pass").classList;

  if (pass.type === "password") {
    pass.type = "text";
    buttonClasses.add("checked");
  } else {
    pass.type = "password";
    buttonClasses.remove("checked");
  }
}
