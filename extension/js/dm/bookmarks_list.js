define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function($, _, Backbone, DM) {

  var Bookmarkslist;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  Bookmarkslist = Backbone.View.extend({
    /** @inheritDoc */
    initialize: function() {
      this.listenTo(this.model, 'all', this.render);
      this.model.fetch();
    },
    /** @inheritDoc */
    render: function() {
      var t;
      t = DM['extension/templates/bookmarks_list.html'];
      this.$el.html(t(this.model.toJSON()));
      return this.$el;
    }
  });

  return Bookmarkslist;
});
