/**
 * @fileOverview The view to add or edit bookmarks.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function($, _, Backbone, DM) {

  var BookmarkForm;

  /**
   * @constructor
   */
  BookmarkForm = Backbone.View.extend({
    template: DM['extension/templates/add_bookmark_form.html'],
    events: {
      'keyup #bookmark-form-tag-input': 'handleTagKey_',
      'click .save-btn': 'handleSave_',
      'click .cancel-btn': 'handleCancel_'
    },
    /** @inheritDoc */
    initialize: function() {
      this.listenTo(this.model, 'change:url', this.updateModel_);
      this.listenTo(this.model, 'all', this.render);
    },
    /**
     * @private
     */
    updateModel_: function() {
      this.model.fetch();
    },
    /** @inheritDoc */
    render: function() {
      var context;
      context = _.clone(this.model.toJSON());
      context.formattedTags = '';
      context.tags = _.map(context.tags, function(tag) {
        return {
          id: tag,
          tag: tag
        };
      });
      this.$el.html(this.template(context));
      return this.$el;
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagKey_: function(event) {
      if (event.keyCode === 188) {
        this.handleTagComma_(event);
      }
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagComma_: function(event) {
      var element, value, tag, t;
      element = $(event.target);
      value = element.val();
      tag = $.trim(value.substr(0, value.length - 1));
      t = DM['extension/templates/selected_tag.html'];
      $('#bookmark-form-tag-list').append($(t({
        id: tag,
        tag: tag
      })));
      element.val('');
    },
    /**
     * @param {Object} event
     * @private
     */
    handleSave_: function(event) {
      event.preventDefault();
      this.storeFormContents_();
      this.model.save();
      this.trigger(BookmarkForm.Event.CLOSE);
    },
    /**
     * @private
     */
    storeFormContents_: function() {
      var url, title, rawTags, tags, notes;
      url = $.trim($('#bookmark-form-url').val());
      title = $.trim($('#bookmark-form-title').val());
      rawTags = $.trim($('#bookmark-form-tag-input').val());
      notes = $.trim($('#bookmark-form-notes').val());
      if (_.isEmpty(rawTags)) {
        tags = [];
      } else {
        tags = _.map(rawTags.split(','), function(tag) {
          return $.trim(tag);
        });
      }
      this.model.set({
        url: url,
        title: title,
        tags: tags,
        notes: notes
      });
    },
    /**
     * @param {Object} event
     * @private
     */
    handleCancel_: function(event) {
      event.preventDefault();
      this.dispose();
      _.defer(_.bind(function() {
        this.trigger(BookmarkForm.Event.CANCEL);
      }, this));
    },
    dispose: function() {
      this.$el.remove();
      this.stopListening();
    }
  });

  /**
   * @enum {string}
   */
  BookmarkForm.Event = {
    CLOSE: 'close',
    CANCEL: 'cancel'
  };

  return  BookmarkForm;
});
