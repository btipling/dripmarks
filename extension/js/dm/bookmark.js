/**
 * @fileOverview The model used to represent bookmarks.
 */
define([
  'underscore',
  'backbone',
  './loading'
], function(_, Backbone, loading) {

  var Bookmark;

  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  Bookmark = Backbone.Model.extend({
    /** @inheritDoc */
    defaults: {
      contentAvailable: false
    },
    /** @inheritDoc */
    initialize: function(attributes, options) {
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
      switch (method) {
        case 'read':
          this.populateFromDropbox_();
          break;
        case 'create':
          this.saveToDropbox_();
          break;
        case 'update':
          this.saveToDropbox_();
          break;
        case 'delete':
          console.log('deleting');
          break;
      }
    },
    populateFromDropbox_: function() {

      var record, data;

      record = this.getRecord_();
      if (!record) {
        return;
      }
      data = record.getFields();
      data.tags = data.tags.toArray();
      data.id = record.getId();
      this.set(data);
    },
    /**
     * @private
     * @return {Dropbox.Datastore.Record}
     */
    getRecord_: function() {

      var bookmarks, url, results;

      bookmarks = this.datastore_.getTable('bookmarks');
      if (this.id) {
        return bookmarks.get(this.id) || null;
      }
      url = this.get('url');
      if (!url) {
        return null;
      }
      results = bookmarks.query({url: url});
      if (_.isEmpty(results)) {
        return null;
      }
      return results[0];
    },
    /**
     * @private
     */
    saveToDropbox_: function() {
      var bookmarks, results, bm, rawData, data, tags, currentTags, removed,
        added, tagsTable, deleteKeys;
      bookmarks = this.datastore_.getTable('bookmarks');
      tagsTable = this.datastore_.getTable('tags');
      results = bookmarks.query({url: this.get('url')});
      rawData = this.toJSON();
      data = _.clone(rawData);
      delete data.tags;
      deleteKeys = [];
      _.each(data, function(value, key) {
        if (!_.isNumber(value) && !_.isString(value) && !_.isBoolean(value)) {
          deleteKeys.push(key);
        }
      });
      // So I'm not modifying data while iterating over it:
      _.each(deleteKeys, function(key) {
        delete data[key];
      });
      if (_.isEmpty(results)) {
        bm = bookmarks.insert(_.extend(data, {
          created: new Date(),
          updated: new Date()
        }));
        tags = bm.getOrCreateList('tags');
        _.each(rawData.tags, function(tag) {
          this.addTagToBoomkark_(tag, tags, tagsTable, bm.getId());
        }, this);
      } else {
        bm = results[0];
        _.each(data, function (value, key) {
          bm.set(key, value);
        });
        tags = bm.getOrCreateList('tags');
        currentTags = tags.toArray();
        removed = _.difference(currentTags, rawData.tags);
        added = _.difference(rawData.tags, currentTags);
        _.each(removed, function(tag) {
          this.removeTagFromBookmark_(tag, tags, tagsTable, bm.getId());
        }, this);
        _.each(added, function(tag) {
          this.addTagToBoomkark_(tag, tags, tagsTable, bm.getId());
        }, this);
        bm.set('updated', new Date());
      }
      loading.showLoading(loading.namespaces.DATA_SYNC);
    },
    /**
     * @param {string} tagName
     * @param {Dropstore.List} tags
     * @param {Dropstore.Table} tagsTable
     * @param {string} bmid
     * @private
     */
    addTagToBoomkark_: function(tagName, tags, tagsTable, bmid) {

      var results, tag, bookmarksList, bookmarks;

      results = tagsTable.query({tag: tagName});
      if (_.isEmpty(results)) {
        tag = tagsTable.insert({
          tag: tagName,
          bookmarks: [bmid]
        });
      } else {
        tag = results[0];
        bookmarksList = tag.getOrCreateList('bookmarks');
        bookmarks = bookmarksList.toArray();
        if (_.indexOf(bookmarks, bmid) === -1) {
          bookmarksList.push(bmid);
        }
      }
      tags.push(tagName);
    },
    /**
     * @param {string} tagName
     * @param {Dropstore.List} tagsList
     * @param {Dropstore.Table} tagsTable
     * @param {string} bmid
     * @private
     */
    removeTagFromBookmark_: function(tagName, tagsList, tagsTable, bmid) {

      var results, index, tag, tags, bookmarksList, bookmarks;

      results = tagsTable.query({tag: tagName});
      if (!_.isEmpty(results)) {
        tag = results[0];
        bookmarksList = tag.getOrCreateList('bookmarks');
        bookmarks = bookmarksList.toArray();
        index = _.indexOf(bookmarks, bmid);
        if (index !== -1) {
          bookmarksList.remove(index);
        }
      }
      tags = tagsList.toArray();
      index = _.indexOf(tags, tagName);
      if (index !== -1) {
        tagsList.remove(index);
      }
    }
  });

  return Bookmark;

});
