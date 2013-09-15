define([
  'jquery',
  'dropbox',
  './auth',
  './tags',
  './tagslist',
  './bookmarks',
  './bookmarks_list'
], function($, Dropbox, auth, Tags, TagsList, Bookmarks, Bookmarkslist) {

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
      var tagslist, tags, bookmarksList, bookmarks;
      if (error) {
        auth.auth();
        return;
      }
      tags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tagslist = new TagsList({
        model: tags
      });
      $('#tags-container').html(tagslist.render());
      bookmarks = new Bookmarks([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
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
