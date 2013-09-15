/**
 * @fileOverview Boomarks collection.
 */
define([
  'underscore',
  'backbone',
  './bookmark'
], function(_, Backbone, Bookmark) {

  var Bookmarks;

  /**
   * @constructor
   * @extends {Backbone.Collection}
   */
  Bookmarks = Backbone.Collection.extend({
    model: Bookmark,
    /** @inheritDoc */
    initialize: function(data, options) {
      /**
       * @type {Dropbox.DataStore.Client}
       * @private
       */
      this.client_ = options.client;
      /**
       * @type {Dropbox.DataStore.DataManager}
       * @private
       */
      this.datamanager_ = options.datamanager;
      /**
       * @type {Dropbox.DataStore.DataStore}
       * @private
       */
      this.datastore_ = options.datastore;
      /**
       * @type {Array.<string>}
       * @private
       */
      this.ids_ = options.ids;
    },
    /** @inheritDoc */
    sync: function(method) {
      if (method === 'read') {
        if (!this.ids_) {
          return;
        }
        _.each(this.ids_, function(id) {
          var bm;
          bm = new Bookmark({id: id}, {
            client: this.client_,
            datamanager: this.datamanager_,
            datastore: this.datastore_
          });
          bm.fetch();
          this.add(bm);
        }, this);
      }
    }
  });

  return Bookmarks;
});
