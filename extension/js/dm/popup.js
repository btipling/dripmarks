/**
 * @fileOverview Set up the popup with the add bookmark form.
 */
define([
  'jquery',
  'underscore',
  'dropbox',
  './bookmark_form',
  './bookmark',
  './readability'
], function($, _, Dropbox, BookmarkForm, Bookmark, Readability) {

  function auth() {
    var b;
    b = chrome.extension.getBackgroundPage();
    b.auth();
  }

  /**
   * @param {Bookmark} bookmark
   */
  function getCurrentTabInfo(bookmark) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var current;
      if (_.isEmpty(tabs)) {
        return;
      }
      current = tabs[0];
      bookmark.set({title: current.title, url: current.url});
      if (current.url) {
        Readability.populateBookmark(current.url, bookmark);
      }
    });
  }

  function main() {

    var token, client, bookmarkForm, bookmark;

    token = localStorage.dropboxAccessToken;
    if (!token) {
      auth();
    }

    client = new Dropbox.Client({token: token});
    if (!client.isAuthenticated()) {
      auth();
    }
    bookmark = new Bookmark();
    bookmarkForm = new BookmarkForm({model: bookmark});
    $('#content').append(bookmarkForm.render());
    getCurrentTabInfo(bookmark);
  }

  return {
    main: main
  };
});
