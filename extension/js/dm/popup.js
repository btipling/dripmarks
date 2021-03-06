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
  './loading',
  './tags'
], function($, _, Dropbox, BookmarkForm, Bookmark, Readability, auth, loading,
    Tags) {

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

      var bookmark, bookmarkForm, tags;

      loading.hideLoading();
      if (error) {
        auth.auth();
        window.close();
      }
      bookmark = new Bookmark({}, {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tags.fetch();
      datastore.syncStatusChanged.addListener(function() {
        var status;
        status = datastore.getSyncStatus();
        if (!status.uploading) {
          if (loading.isLoading(loading.namespaces.DATA_SYNC)) {
            loading.hideLoading(loading.namespaces.DATA_SYNC);
            if (closeWindow) {
              datastore.close();
              closePopup();
            }
          }
        }
      });
      bookmarkForm = new BookmarkForm({model: bookmark, tags: tags});
      bookmarkForm.on(BookmarkForm.Event.CLOSE, function() {
        var status;
        status = datastore.getSyncStatus();
        if (status.uploading) {
          closeWindow = true;
          return;
        }
        datastore.close();
        closePopup();
      });
      bookmarkForm.on(BookmarkForm.Event.CANCEL, function() {
        datastore.close();
        closePopup();
      });
      $('#content').html(bookmarkForm.render());
      getCurrentTabInfo(bookmark);
    });
  }

  function closePopup() {
    window.close();
  }

  return {
    main: main
  };
});
