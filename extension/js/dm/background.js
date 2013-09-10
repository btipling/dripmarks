var client;
function auth(token) {
  console.log('background!', Dropbox);
  if (!token) {
    token = localStorage.dropboxAccessToken;
  }
  if (!token) {
    client = new Dropbox.Client({key: 'y1vpbd2xo51cd3r'});
  } else {
    localStorage.dropboxAccessToken = token;
    client = new Dropbox.Client({token: token});
  }
  console.log('client!', client);
  client.authenticate();
  console.log('client authed', client);
}

function run() {
  if (!client || !client.isAuthenticated()) {
    console.log('Not authenticated.');
    return;
  }
  console.log('authenticated!');
}

auth();
run();
