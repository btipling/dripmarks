/**
 * @fileOverview A list of tags for the bookmark browser.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function($, _, Backbone, DM) {

  var TagsList;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  TagsList = Backbone.View.extends({
    /** @inheritDoc */
    initialize: function() {
    },
    /** @inheritDoc */
    render: function() {
      var t;
      t = DM['extension/templates/tags_list.html'];
      this.$el.html(t(this.model.toJSON()));
      return this.$el;
    }
  });

  return TagsList;
});
