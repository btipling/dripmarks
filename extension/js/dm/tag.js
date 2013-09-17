/**
 * @fileOverview A model representing a tag.
 */
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var Tag;

  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  Tag = Backbone.Model.extend({
    defaults: {
      tagName: 'No name'
    },
    /** @inheritDoc */
    initialize: function(data, options) {
      this.datastore_ = options.datastore;
    },
    /** @inheritDoc */
    sync: function(method) {
      var tagsTable, tagname, tagRecord, bookmarksTable, bookmarks;
      if (method === 'delete') {
        bookmarksTable = this.datastore_.getTable('bookmarks');
        tagsTable = this.datastore_.getTable('tags');
        tagRecord = tagsTable.get(this.id);
        tagname = this.get('tag');
        if (tagRecord) {
          tagRecord.deleteRecord();
        }
        bookmarks = bookmarksTable.query({});
        if (!tagname) {
          return;
        }
        _.each(bookmarks, function(bookmarkRecord) {
          var bm, tags, index;
          bm = bookmarkRecord.getFields();
          if (!bm.tags) {
            return;
          }
          tags = bm.tags.toArray();
          index = tags.indexOf(tagname);
          if (index === -1) {
            return;
          }
          bm.tags.splice(index, 1);
        });
      }
    }
  });

  return Tag;

});
