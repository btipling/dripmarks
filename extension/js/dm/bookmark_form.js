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
    dispose: function() {
      this.stopListening();
    }
  });

  return  BookmarkForm;
});
