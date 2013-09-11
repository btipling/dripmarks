define([
  './dropbox_api_access',
  'dropbox'
], function(DropboxApiAccess, Dropbox) {

  var client;

  function auth(token) {
    if (!token) {
      token = localStorage.dropboxAccessToken;
    }
    if (!token) {
      client = new Dropbox.Client({key: DropboxApiAccess.key});
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
