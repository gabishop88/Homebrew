var socket;
var campaign_data;
var misc_data;

var p;

function setup() {
  // socket = io.connect('https://homebrew.serverless.social/'); //Connect here when I use the lt
  socket = io.connect('localhost:3000');  //Connect here as a backup. This shuold be temporary.
  socket.on('data-return', saveData);

  createCanvas(400, 400);
  background(51);

  console.log("Hello! Welcome to the Homebrew");

  p = document.getElementById('test-json'); // For testing

  var dataReq = {
    src: "./assets/data/campaigns/example-campaign.json",
    type: "campaign"
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

function draw() {
}

function logButton() {
  var data = "Pressed the button";
  socket.emit('button', data);
}
