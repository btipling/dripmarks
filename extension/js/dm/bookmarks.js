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
        if (!this.ids_ || _.isEmpty(this.ids_)) {
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

      var bookmarks, results, bookmarksToAdd;

      bookmarks = this.datastore_.getTable('bookmarks');
      results = _.clone(bookmarks.query({}));
      results.reverse();
      bookmarksToAdd = _.map(results, function(result) {
        var bm;
        bm = result.getFields();
        bm.tags = bm.tags.toArray();
        bm.id = result.getId();
        return new Bookmark(bm, {
          client: this.client_,
          datamanager: this.datamanager_,
          datastore: this.datastore_
        });
      }, this);
      this.reset(bookmarksToAdd);
    },
    /**
     * @private
     */
    populateFromIds_: function() {
      var bookmarks, ids;
      bookmarks = [];
      ids = _.clone(this.ids_);
      ids.reverse();
      _.each(ids, function(id) {

        var bm;

        bm = new Bookmark({id: id}, {
          client: this.client_,
          datamanager: this.datamanager_,
          datastore: this.datastore_
        });
        // Dropbox is synchronous:
        if (bm.id) {
          bookmarks.push(bm);
        }
      }, this);
      _.each(bookmarks, function(bm) {
        _.defer(function() {
          bm.fetch();
        });
      });
      this.reset(bookmarks);
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
