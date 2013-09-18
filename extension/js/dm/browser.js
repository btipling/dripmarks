define([
  'jquery',
  'underscore',
  'dropbox',
  './auth',
  './tags',
  './tagslist',
  './bookmarks',
  './bookmarks_list',
  './loading',
  './utils'
], function($, _, Dropbox, auth, Tags, TagsList, Bookmarks, Bookmarkslist,
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
        if (window.confirm('Delete it all?')) {
          utils.clearAllRecords(datastore.getTable('bookmarks'));
          utils.clearAllRecords(datastore.getTable('tags'));
        }
      }
      loading.hideLoading();
      utils.manageSyncLoading(datastore);
      if (error) {
        auth.auth();
        return;
      }
      selectedTags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore,
        selectedTags: selectedTags
      });
      bookmarks = new Bookmarks([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tagslist = new TagsList({
        model: tags,
        bookmarks: bookmarks
      });
      $('#tags-container').html(tagslist.render());
      bookmarksList = new Bookmarkslist({
        model: bookmarks
      });
      $('#bookmarks-container').html(bookmarksList.render());
      datastore.recordsChanged.addListener(_.partial(_.debounce(function() {
        tags.fetch();
        bookmarks.fetch();
      }, 1000)));
    });

  }

  return {
    main: main
  };
});
