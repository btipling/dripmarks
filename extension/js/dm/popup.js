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
  './auth',
  './loading'
], function($, _, Dropbox, BookmarkForm, Bookmark, Readability, auth, loading) {

  var closeWindow;

  /**
   * @type {boolean}
   */
  closeWindow = false;

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
    loading.showLoading();
    datamanager.openDefaultDatastore(function(error, datastore) {

      var bookmark, bookmarkForm;

      loading.hideLoading();
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
        var status;
        status = datastore.getSyncStatus();
        if (!status.uploading) {
          if (loading.isLoading(loading.namespaces.DATA_SYNC)) {
            loading.hideLoading(loading.namespaces.DATA_SYNC);
            if (closeWindow) {
              window.close();
            }
          }
        }
      });
      bookmarkForm = new BookmarkForm({model: bookmark});
      bookmarkForm.on(BookmarkForm.Event.CLOSE, function() {
        var status;
        status = datastore.getSyncStatus();
        if (status.uploading) {
          closeWindow = true;
          return;
        }
        _.defer(function() {
          window.close();
        });
      });
      $('#content').append(bookmarkForm.render());
      getCurrentTabInfo(bookmark);
    });
  }

  return {
    main: main
  };
});
