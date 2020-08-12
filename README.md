# Homebrew
Website for homebrew campaigns


TODO List:
- Use the connectedClient and active attributes in users.json, along with socket.on('refresh') to control logging into an Account
- Complete logic for sign up button to add a new user to users.json.
- Allow players to join campaigns (password?), and use campaign id as rooms to group sockets.
- Finish making sure the left-bars are only displayed when needed.
- Change socket based data requests to GET requests
- perhaps create new .js files to organize functions.
- maybe try to combine 'logged-in' and 'username' local Storages into a single 'login-info' object

Details for how login should work:
- User gives correct login credentials
- When user clicks log in button, emit the login attempt
- server verifies, and account is not currently active.
  - save socket.id in users.json as active user, and set user as active: true.
  - emit a message back on socket letting client know login was successful.
  - save username to localStorage
- when a user connects, try to log them into the account stored in LocalStorage if it is not active
