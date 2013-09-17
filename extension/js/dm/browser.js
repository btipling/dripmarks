define([
  'jquery',
  'dropbox',
  './auth',
  './tags',
  './tagslist',
  './bookmarks',
  './bookmarks_list',
  './loading',
  './utils'
], function($, Dropbox, auth, Tags, TagsList, Bookmarks, Bookmarkslist,
    loading, utils) {

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

      var tagslist, tags, bookmarksList, bookmarks, selectedTags;

      if (window.location.search.indexOf('__clear__') !== -1) {
        utils.clearAllRecords(datastore.getTable('bookmarks'));
        utils.clearAllRecords(datastore.getTable('tags'));
      }
      loading.hideLoading();
      utils.manageSyncLoading(datastore);
      if (error) {
        auth.auth();
        return;
      }
      tags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      selectedTags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      bookmarks = new Bookmarks([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tagslist = new TagsList({
        model: tags,
        bookmarks: bookmarks,
        selectedTags: selectedTags
      });
      $('#tags-container').html(tagslist.render());
      bookmarksList = new Bookmarkslist({
        model: bookmarks
      });
      $('#bookmarks-container').html(bookmarksList.render());
    });

  }

  return {
    main: main
  };
});
