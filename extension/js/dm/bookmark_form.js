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
      this.listenTo(this.model, 'all', this.render);
    },
    /** @inheritDoc */
    render: function() {
      var t;
      t = DM['extension/templates/add_bookmark_form.html'];
      this.$el.html(t(this.model.toJSON()));
      return this.$el;
    },
    /**
     * @param {Object} event
     * @private
     */
    handleSave_: function(event) {
      event.preventDefault();
    },
    /**
     * @param {Object} event
     * @private
     */
    handleCancel_: function(event) {
      event.preventDefault();
      this.dispose();
      this.trigger(BookmarkForm.Event.CANCEL);
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
    CANCEL: 'cancel'
  };

  return  BookmarkForm;
});
