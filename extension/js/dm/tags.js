/**
 * @fileOverview Boomarks collection.
 */
define([
  'underscore',
  'backbone',
  './tag'
], function(_, Backbone, Tag) {

  var Tags;

  /**
   * @constructor
   * @extends {Backbone.Collection}
   */
  Tags = Backbone.Collection.extend({
    model: Tag,
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
    },
    /** @inheritDoc */
    sync: function(method) {

      var tagsTable, tagRecords;

      if (method === 'read') {
        tagsTable = this.datastore_.getTable('tags');
        tagRecords = tagsTable.query({});
        _.each(tagRecords, function(tagRecord) {

          var tag;

          tag = tagRecord.getFields();
          tag.bookmarks = tag.bookmarks.toArray();
          this.add(tag);
        }, this);
      }
    },
    numTagsComparatorAlt: function(tag) {
      return (tag.get('bookmarks') || []).length;
    },
    numTagsComparator: function(tag) {
      return this.numTagsComparatorAlt(tag) * -1;
    },
    alphaComparator: function(tag) {
      return tag.get('tag');
    },
    alphaComparatorAlt: function(tagA, tagB) {
      var a, b;
      a = tagA.get('tag');
      b = tagB.get('tag');
      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    }
  });

  return Tags;
});

