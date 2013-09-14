/**
 * @fileOverview The model used to represent bookmarks.
 */
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var Bookmark;

  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  Bookmark = Backbone.Model.extend({
    defaults: {
      contentAvailable: false,
      loadingContent: true
    },
    sync: function() {
      window.console.log('syncing!', arguments);
      window.console.log('json', this.toJSON());
    }
  });

  return Bookmark;

});
