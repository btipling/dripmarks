/**
 * @fileOverview A tag dropdown selector thing.
 */
define([
  'backbone',
  'templates'
], function(Backbone, DM) {

  var TagSelector;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  TagSelector = Backbone.View.extend({
    /** @inheritDoc */
    initialize: function() {
      this.listenTo(this.model, 'all', this.render);
    },
    /** @inheritDoc */
    render: function() {
      var t;
      t = DM['extension/templates/tag_selector.html'];
      this.$el.html(t(this.model.toJSON()));
      return this.$el;
    },
    dispose: function() {
      this.stopListening();
      this.$el.remove();
    }
  });

  return TagSelector;
});
