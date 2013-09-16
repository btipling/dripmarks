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
      var t, context;
      t = DM['extension/templates/bookmarks_list.html'];
      context = this.model.toJSON();
      this.$el.html(t(context));
      return this.$el;
    }
  });

  return Bookmarkslist;
});
