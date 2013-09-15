/**
 * @fileOverview Set up the popup with the add bookmark form.
 */
define([
  'jquery',
  'underscore',
  'dropbox',
  './bookmark_form',
  './bookmark',
  './readability',
  './auth'
], function($, _, Dropbox, BookmarkForm, Bookmark, Readability, auth) {

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

    var token, client, datamanager;

    token = localStorage.dropboxAccessToken;
    if (!token) {
      auth.auth();
      return;
    }

    client = new Dropbox.Client({token: token});
    if (!client.isAuthenticated()) {
      auth.auth();
      return;
    }
    datamanager = client.getDatastoreManager();
    datamanager.openDefaultDatastore(function(error, datastore) {
      var bookmark, bookmarkForm;
      if (error) {
        auth.auth();
        window.close();
      }
      bookmark = new Bookmark({}, {
        client: client,
        datamanager: datastore,
        datastore: datastore
      });
      datastore.syncStatusChanged.addListener(function() {
        // console.log('syncStatus', datastore.getSyncStatus(), arguments);
      });
      bookmarkForm = new BookmarkForm({model: bookmark});
      bookmarkForm.on(BookmarkForm.Event.CANCEL, function() {
        window.close();
      });
      $('#content').append(bookmarkForm.render());
      getCurrentTabInfo(bookmark);
    });
  }

  return {
    main: main
  };
});
