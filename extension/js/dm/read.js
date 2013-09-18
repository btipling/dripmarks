/**
 * @fileOverview The view where you can read a bookmark's contents.
 */
define([
  'backbone',
  'templates'
], function($, _, Backbone, DM) {

  var Read;

  Read = Backbone.View.extend({
    /** @inheritDoc */
    className: 'read',
    /** @inheritDoc */
    events: {
      'click .close-read': this.close_
    },
    /** @inheritDoc */
    render: function() {
      var t;
      t = DM['extension/templates/read.html'];
      this.$el.html(t(this.model.toJSON()));
      return this.$el;
    },
    /**
     * @private
     */
    close_: function() {
      this.dispose();
    },
    dispose: function() {
      this.stopListening();
      this.remove();
    }
  });

  return Read;
});
