/**
 * @fileOverview A list of tags for the bookmark browser.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  './tags',
  './undo'
], function($, _, Backbone, DM, Tags, Undo) {

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
      this.listenTo(this.model, 'all', this.render);
      this.listenTo(this.model, Tags.Events.SELECTED_TAG,
        this.handleSelectUpdated_);
      this.listenTo(this.model, 'sort', this.render);
      this.model.comparator = this.model.numTagsComparator;
      this.model.fetch();
      /**
       * @type {Undo}
       * @private
       */
      this.undoView_ = null;
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
        selectedTags: this.model.getSelectedTags()
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
      var tag;
      tag = this.getTagFromEvent_(event);
      this.model.addSelectedTag(tag);
    },
    /**
     * @private
     */
    handleSelectUpdated_: function() {
      this.options.bookmarks.setIds(this.model.getBookmarkIds());
    },
    /**
     * @param {Object} event
     * @private
     */
    deselectTag_: function(event) {
      this.model.removeSelectedTagById(event.target.id);
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
      this.setupUndoForTag_(tag);
      tag.destroy();
    },
    /**
     * @param {Tag} tag
     */
    setupUndoForTag_: function(tag) {
      if (_.isNull(this.undoView_)) {
        this.undoView_ = new Undo();
        this.undoView_.on(Undo.Events.CLOSE, _.bind(function() {
          this.undoView_ = null;
        }, this));
        this.undoView_.render();
        $(document.body).append(this.undoView_.$el);
      }
      this.undoView_.addTagUndo(tag.get('name'), tag.get('bookmarks'));
    }
  });

  return TagsList;
});
