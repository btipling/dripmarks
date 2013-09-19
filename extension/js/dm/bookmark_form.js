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
      'blur #bookmark-form-tag-input': 'handleTagBlur_',
      'click .bookmark-form-fake-input': 'handleFakeInputClick_',
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
     * @private
     */
    handleFakeInputClick_: function() {
      $('#bookmark-form-tag-input').focus();
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagKey_: function(event) {
      if (event.keyCode === 188) {
        this.handleTagComma_(event);
      } else if (event.keyCode === 8) {
        this.handleTagBackspace_(event);
      }
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagBackspace_: function(event) {
      var element, lastTag;
      element = $(event.target);
      if (!_.isEmpty(element.val())) {
        return;
      }
      lastTag = $('.tag', this.$el).last();
      if (lastTag) {
        lastTag.remove();
      }
    },
    /**
     * @param {boolean} trim_trailing To trim comma if needed.
     * @param {Element=} opt_element If given, don't look it up.
     * @return {string}
     */
    getTagInput_: function(trim_trailing, opt_element) {
      var element, value, tag;
      element = opt_element ? $(opt_element) : $('#bookmark-form-tag-input');
      value = element.val();
      if (trim_trailing) {
        tag = $.trim(value.substr(0, value.length - 1));
      } else {
        tag = $.trim(value);
      }
      element.val('');
      return tag;
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagComma_: function(event) {
      var tag;
      tag = this.getTagInput_(true, event.target);
      this.appendTagToForm_(tag);
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagBlur_: function(event) {
      var tag;
      tag = this.getTagInput_(false, event.target);
      this.appendTagToForm_(tag);
    },
    /**
     * @param {string} tag
     * @private
     */
    appendTagToForm_: function(tag) {
      var t, tags;
      if (_.isEmpty(tag)) {
        return;
      }
      tags = this.getTagsFromForm_();
      if (_.indexOf(tags, tag) !== -1) {
        return;
      }
      t = DM['extension/templates/selected_tag.html'];
      $('#bookmark-form-tag-list').append($(t({
        id: tag,
        tag: tag
      })));
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
     * @return {Array.<string>}
     */
    getTagsFromForm_: function() {
      var tags;
      tags = [];
      $('.tag', this.$el).each(function(index, tag) {
        var tagName;
        tagName = $(tag).attr('data-for-id');
        tagName = $.trim(tagName);
        if (!_.isEmpty(tagName)) {
          tags.push(tagName);
        }
      });
      return tags;
    },
    /**
     * @private
     */
    storeFormContents_: function() {
      var url, title, tags, notes, tag;
      url = $.trim($('#bookmark-form-url').val());
      title = $.trim($('#bookmark-form-title').val());
      notes = $.trim($('#bookmark-form-notes').val());
      tags = this.getTagsFromForm_();
      tag = this.getTagInput_(false);
      if (!_.isEmpty(tag)) {
        tags.push(tag);
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
