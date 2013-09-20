/**
 * @fileOverview The view to add or edit bookmarks.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  './tag_selector'
], function($, _, Backbone, DM, TagSelector) {

  var BookmarkForm;

  /**
   * @constructor
   */
  BookmarkForm = Backbone.View.extend({
    template: DM['extension/templates/add_bookmark_form.html'],
    events: {
      'keyup #bookmark-form-tag-input': 'handleTagKey_',
      'keydown #bookmark-form-tag-input': 'handleTagKeyDown_',
      'focus #bookmark-form-tag-input': 'handleTagFocus_',
      'blur #bookmark-form-tag-input': 'handleTagBlur_',
      'click .bookmark-form-fake-input': 'handleFakeInputClick_',
      'click .save-btn': 'handleSave_',
      'click .cancel-btn': 'handleCancel_'
    },
    /** @inheritDoc */
    initialize: function() {
      this.listenTo(this.model, 'change:url', this.updateModel_);
      this.listenTo(this.model, 'all', this.render);
      /**
       * @type {Tags}
       * @private
       */
      this.tags_ = this.options.tags;
      /**
       * @type {TagSelector}
       * @private
       */
      this.tagSelector_ = null;
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
      _.defer(function() {
        $('#bookmark-form-tag-input').focus();
      });
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
    handleTagKeyDown_: function(event) {
      if (event.keyCode === 8) {
        this.handleTagBackspace_(event);
      }
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagKey_: function(event) {
      var tag;
      if (event.keyCode === 188) {
        this.handleTagComma_(event);
      } else if (event.keyCode === 38) {
        this.handleTagUp_(event);
        return;
      } else if (event.keyCode === 40) {
        this.handleTagDown_(event);
        return;
      }
      if (!_.isNull(this.tagSelector_)) {
        tag = this.getTagInput_(false, false);
        this.populateAvailableTags_(tag, 0, this.tagSelector_.model);
      }
    },
    /**
     * @param {Object} tag
     * @param {number} index
     * @private
     */
    updateSelected_: function(tag, index) {
      if (tag) {
        tag.set('isSelected', false);
      }
      tag = this.tagSelector_.model.at(index);
      tag.set('isSelected', true);
      $('#bookmark-form-tag-input').val(tag.get('tag'));
    },
    /**
     * @private
     */
    handleTagUp_: function() {
      var index, m;
      if (_.isNull(this.tagSelector_)) {
        return;
      }
      m = this.tagSelector_.model.findWhere({isSelected: true});
      if (m) {
        index = this.tagSelector_.model.indexOf(m);
        index--;
      } else {
        index = -1;
      }
      if (index === -1) {
        index = this.tagSelector_.model.length - 1;
      }
      this.updateSelected_(m, index);
    },
    /**
     * @private
     */
    handleTagDown_: function() {
      var index, m;
      if (_.isNull(this.tagSelector_)) {
        return;
      }
      m = this.tagSelector_.model.findWhere({isSelected: true});
      if (m) {
        index = this.tagSelector_.model.indexOf(m);
        index++;
      } else {
        index = 0;
      }
      if (index === this.tagSelector_.model.length) {
        index = 0;
      }
      this.updateSelected_(m, index);
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
     * @param {boolean} trimTrailing To trim comma if needed.
     * @param {boolean} deleteContent Delete content once fetched.
     * @param {Element=} opt_element If given, don't look it up.
     * @return {string}
     */
    getTagInput_: function(trimTrailing, deleteContent, opt_element) {
      var element, value, tag;
      element = opt_element ? $(opt_element) : $('#bookmark-form-tag-input');
      value = $.trim(element.val());
      if (trimTrailing) {
        tag = value.substr(0, value.length - 1);
      } else {
        tag = value;
      }
      if (deleteContent) {
        element.val('');
      }
      return tag;
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagComma_: function(event) {
      var tag;
      tag = this.getTagInput_(true, true, event.target);
      this.appendTagToForm_(tag);
    },
    /**
     * @param {Object} event
     * @private
     */
    handleTagBlur_: function(event) {
      var tag;
      tag = this.getTagInput_(false, true, event.target);
      this.appendTagToForm_(tag);
      if (!_.isNull(this.tagSelector_)) {
        this.tagSelector_.dispose();
      }
      $('#bookmark-form-tag-auto-complete').hide();
    },
    /**
     * @param {string} value
     * @param {number} selectedIndex
     * @param {Backbone.Collection} collection
     * @private
     */
    populateAvailableTags_: function(value, selectedIndex, collection) {
      var tags, offset;
      collection.reset();
      offset = 1;
      if (!_.isEmpty(value)) {
        collection.push({
          tag: value,
          isSelected: selectedIndex === 0
        });
      }
      value = $.trim(value);
      tags = this.tags_.toJSON();
      if (!_.isEmpty(value)) {
        tags = _.filter(tags, function(tag) {
          return tag.tag.indexOf(value) === 0 && tag.tag !== value;
        });
      }
      tags = tags.slice(0, 5);
      _.each(tags, function(tag, index) {
        collection.push({
          tag: tag.tag,
          isSelected: selectedIndex === index + offset
        });
      });
    },
    /**
     * @private
     */
    handleTagFocus_: function() {
      var tagSelector, collection, element;
      collection = new Backbone.Collection();
      this.populateAvailableTags_('', 0, collection);
      tagSelector = new TagSelector({
        model: collection
      });
      element = $('#bookmark-form-tag-auto-complete');
      element.html(tagSelector.render());
      element.show();
      this.tagSelector_ = tagSelector;
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
      tag = this.getTagInput_(false, true);
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
