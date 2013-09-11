define([
  'jquery',
  'dropbox',
  './bookmark_form'
], function($, Dropbox, BookmarkForm) {

  function auth() {
    var b;
    b = chrome.extension.getBackgroundPage();
    b.auth();
  }

  function main() {

    var token, client, bookmarkForm;

    token = localStorage.dropboxAccessToken;
    if (!token) {
      auth();
    }

    client = new Dropbox.Client({token: token});
    if (!client.isAuthenticated()) {
      auth();
    }
    bookmarkForm = new BookmarkForm();
    $('#content').append(bookmarkForm.render());
  }

  return {
    main: main
  };
});
