/**
 * @fileOverview A list of tags for the bookmark browser.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  'bootstrapAlert',
], function($, _, Backbone, DM) {

  var TagsList;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  TagsList = Backbone.View.extend({
    /** @inheritDoc */
    events: {
      'click .tagName': 'handleSelectTag_',
      'click .selected-tag': 'deselectTag_',
      'click .glyphicon-remove': 'handleRemoveTag_',
      'click .glyphicon-sort-by-alphabet': 'handleSortByAlpha_',
      'click .glyphicon-sort-by-alphabet-alt': 'handleSortByAlphaAlt_',
      'click .glyphicon-sort-by-attributes': 'handleSortByAtr_',
      'click .glyphicon-sort-by-attributes-alt': 'handleSortByAtrAlt_'
    },
    /** @inheritDoc */
    initialize: function() {
      this.selectedTags_ = this.options.selectedTags;
      this.listenTo(this.model, 'all', this.render);
      this.listenTo(this.selectedTags_, 'all', this.render);
      this.listenTo(this.model, 'sort', this.render);
      this.model.comparator = this.model.numTagsComparator;
      this.model.fetch();
    },
    /** @inheritDoc */
    render: function() {
      var t, context;
      t = DM['extension/templates/tags_list.html'];
      context = this.model.toJSON();
      this.$el.html(t({
        tags: _.filter(context, function(tag) {
          return !_.isEmpty(tag.bookmarks);
        }),
        selectedTags: this.selectedTags_.toJSON()
      }));
      return this.$el;
    },
    /**
     * @param {Object} event
     * @private
     * @return {Tag}
     */
    getTagFromEvent_: function(event) {
      var id;
      id = event.target.id;
      return this.model.get(id);
    },
    /**
     * @param {Object} event
     * @private
     */
    handleSelectTag_: function(event) {
      var tag, bookmarks;
      tag = this.getTagFromEvent_(event);
      bookmarks = tag.get('bookmarks');
      this.options.bookmarks.setIds(bookmarks);
      this.selectedTags_.reset([tag]);
    },
    /**
     * @param {Object} event
     * @private
     */
    deselectTag_: function(event) {
      var tag;
      tag = this.getTagFromEvent_(event);
      this.options.bookmarks.setIds([]);
      this.selectedTags_.remove(tag);
    },
    /**
     * @private
     */
    handleSortByAlpha_: function() {
      this.model.comparator = this.model.alphaComparator;
      this.model.sort();
    },
    /**
     * @private
     */
    handleSortByAlphaAlt_: function() {
      this.model.comparator = this.model.alphaComparatorAlt;
      this.model.sort();
    },
    /**
     * @private
     */
    handleSortByAtr_: function() {
      this.model.comparator = this.model.numTagsComparator;
      this.model.sort();
    },
    /**
     * @private
     */
    handleSortByAtrAlt_: function() {
      this.model.comparator = this.model.numTagsComparatorAlt;
      this.model.sort();
    },
    /**
     * @param {Object} event
     * @private
     */
    handleRemoveTag_: function(event) {
      var target, id, tag;
      target = event.target;
      id = $(target).attr('data-for-id');
      tag = this.model.get(id);
      tag.destroy();
    }
  });

  return TagsList;
});
