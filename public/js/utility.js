function randomizeBarLengths() {
  randomizeStyle('title-bar', 'margin-right', 20, 65, '%');
  randomizeStyle('username-bar', 'margin-right', 40, 60, '%');
  randomizeStyle('password-bar', 'margin-right', 40, 60, '%');
  randomizeStyle('submit-bar', 'margin-right', 40, 60, '%');
}

function randomizeStyle(elementId, property, min, max, label) {
  var val = random(min, max);
  var element = document.getElementById(elementId);
  element.setAttribute('style', property + ": " + val + label + ";");
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
