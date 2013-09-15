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
    events: {
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
      var t, context;
      t = DM['extension/templates/add_bookmark_form.html'];
      context = _.clone(this.model.toJSON());
      context.formattedTags = '';
      if (context.tags && !_.isEmpty(context.tags)) {
        context.formattedTags = context.tags.join(', ');
      }
      this.$el.html(t(context));
      return this.$el;
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
      //this.dispose();
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
