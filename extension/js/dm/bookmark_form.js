/**
 * @fileOverview The view to add or edit bookmarks.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  './bookmark'
], function($, _, Backbone, DM, Bookmark) {

  var BookmarkForm;

  /**
   * @constructor
   */
  BookmarkForm = Backbone.View.extend({
    model: Bookmark,
    render: function() {
      var t;
      t = DM['extension/templates/add_bookmark_form.html'];
      this.$el.html(t());
      return this.$el;
    }
  });

  return  BookmarkForm;
});
