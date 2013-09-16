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
        this.reset();
        if (!this.ids_) {
          this.populateFromQuery_();
          return;
        }
        this.populateFromIds_();
      }
    },
    /**
     * @private
     */
    populateFromQuery_: function() {

      var bookmarks, results;

      bookmarks = this.datastore_.getTable('bookmarks');
      results = bookmarks.query({});
      _.each(results, function(result) {
        var bm;
        bm = result.getFields();
        bm.tags = bm.tags.toArray();
        this.add(new Bookmark(bm, {
          client: this.client_,
          datamanager: this.datamanager_,
          datastore: this.datastore_
        }));
      }, this);
    },
    /**
     * @private
     */
    populateFromIds_: function() {
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
    },
    /**
     * @param {Array.<string>} ids
     */
    setIds: function(ids) {
      this.ids_ = ids;
      this.fetch();
    }
  });

  return Bookmarks;
});
