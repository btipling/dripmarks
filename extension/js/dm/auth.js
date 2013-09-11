define([
  'dropbox'
], function(Dropbox) {

  var client;

  function auth(token) {
    if (!token) {
      token = localStorage.dropboxAccessToken;
    }
    if (!token) {
      client = new Dropbox.Client({key: 'y1vpbd2xo51cd3r'});
    } else {
      localStorage.dropboxAccessToken = token;
      client = new Dropbox.Client({token: token});
    }
    client.authenticate();
  }

  return {
    auth: auth
  };
});
