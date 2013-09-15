define([
  'jquery',
  'dropbox',
  './auth',
  './tags',
  './tagslist'
], function($, Dropbox, auth, Tags, TagsList) {

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
      var tagslist, tags;
      if (error) {
        auth.auth();
        return;
      }
      console.log('browser running');
      tags = new Tags([], {
        client: client,
        datamanager: datamanager,
        datastore: datastore
      });
      tagslist = new TagsList({
        model: tags
      });
      $('#tags-container').html(tagslist.render());
    });

  }

  return {
    main: main
  };
});
