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
      if (_.isUndefined(options.selectedTags)) {
        return;
      }
      /**
       * A set of selected tags used to facet.
       * @type {Tags=}
       */
      this.selectedTags_ = options.selectedTags;
      this.listenTo(this.selectedTags_, 'all', this.handleSelectedTagUpdate_);
    },
    /** @inheritDoc */
    sync: function(method) {

      var tagsTable, tagRecords;

      if (method === 'read') {
        tagsTable = this.datastore_.getTable('tags');
        tagRecords = tagsTable.query({});
        this.reset();
        _.each(tagRecords, function(tagRecord) {

          var tag;

          tag = tagRecord.getFields();
          tag.bookmarks = tag.bookmarks.toArray();
          tag.id = tagRecord.getId();
          this.add(new Tag(tag, {
            datastore: this.datastore_
          }));
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
    },
    /**
     * @return {Array.<Object>}
     */
    getSelectedTags: function() {
      return this.selectedTags_.toJSON();
    },
    /**
     * @param {Tag} tag
     */
    addSelectedTag: function(tag) {
      this.selectedTags_.reset([tag]);
    },
    /**
     * @param {Tag} tag
     */
    removeSelectedTag: function(tag) {
      this.selectedTags_.remove(tag);
    },
    handleSelectedTagUpdate_: function() {
      this.trigger(Tags.Events.SELECTED_TAG);
    }
  });

  /**
   * @enum {string}
   */
  Tags.Events = {
    SELECTED_TAG: 'selected-tag'
  };

  return Tags;
});

