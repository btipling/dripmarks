/**
 * @fileOverview Handle the oauth token from Dropbox.
 */
define([
  './auth',
  './utils'
], function(auth, utils) {

  function main() {

    var token, i, parts, subparts, hash;

    hash = window.location.hash.substr(1);
    if (!hash || !hash.length) {
      utils.closeTab();
    }
    parts = window.location.hash.substr(1).split('&');
    if (!parts.length) {
      utils.closeTab();
    }
    for (i = 0; i < parts.length; i++) {
      subparts = parts[i].split('=');
      if (subparts[0] === 'access_token') {
        token = subparts[1];
        break;
      }
    }
    if (token) {
      auth.auth(token);
    }
    utils.closeTab();
  }


  return {
    main: main
  };
});
