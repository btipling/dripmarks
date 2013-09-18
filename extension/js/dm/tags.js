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
      this.listenTo(this.selectedTags_, 'all', this.fetch);
    },
    /** @inheritDoc */
    sync: function(method) {

      var tagsTable, tagRecords;

      if (method === 'read') {
        tagsTable = this.datastore_.getTable('tags');
        tagRecords = this.facetTags_(tagsTable.query({}),
          this.selectedTags_.toJSON());
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
      this.trigger(Tags.Events.SELECTED_TAG);
    },
    /**
     * @param {Array.<Dropbox.Datastore.Record>} tagRecords
     * @param {Array.<Object} selectedTags
     * @private
     * @return {Array.<Dropbox.Datastore.Record>}
     */
    facetTags_: function(tagRecords, selectedTags) {
      var currentTag;
      if (_.isEmpty(tagRecords) || _.isEmpty(selectedTags)) {
        return tagRecords;
      }
      currentTag = selectedTags.shift();
      return this.facetTags_(this.facetSingleTag_(tagRecords, currentTag),
        selectedTags);
    },
    /**
     * Filters out tags that don't share bookmarks with selected tag.
     * @param {Array.<Dropbox.Datastore.Record> tagRecords
     * @param {Object} selectedTag
     * @private
     * @return {Array.<Dropbox.Datastore.Record>
     */
    facetSingleTag_: function(tagRecords, selectedTag) {
      var selectedTagBookmarks;
      selectedTagBookmarks = selectedTag.bookmarks;
      return _.filter(tagRecords, function(tagRecord) {
        var bookmarks, tag;
        tag = tagRecord.getFields();
        if (tag.tag === selectedTag.tag) {
          return false;
        }
        bookmarks = tag.bookmarks.toArray();
        return !!_.intersection(selectedTagBookmarks, bookmarks).length;
      }) || [];
    },
    /**
     * Returns the bookmark ids available for all selected tags.
     * @return {Array.<string>}
     */
    getBookmarkIds: function() {
      return _.reduce(this.selectedTags_.toJSON(), function(memo, tag) {
        if (_.isNull(memo)) {
          return tag.bookmarks;
        }
        return _.intersection(tag.bookmarks, memo);
      }, null);
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
      this.selectedTags_.push(tag);
    },
    /**
     * @param {string} tagId
     */
    removeSelectedTagById: function(tagId) {
      var tag;
      tag = this.selectedTags_.get(tagId);
      this.selectedTags_.remove(tag);
      this.fetch();
    },
    /**
     * @return {Dropbox.Datastore.Datastore}
     */
    getDatastore: function() {
      return this.datastore_;
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

