/**
 * @fileOverview A view for showing an undo UI.
 */
define([
  'backbone',
  'templates'
], function(Backbone, DM) {

  var Undo;

  Undo = Backbone.View.extend({
    /** @inheritDoc */
    className: 'undo',
    /** @inheritDoc */
    events: {
      'click .undo-link': 'handleUndo_',
      'click .glyphicon-remove': 'handleRemove_'
    },
    /** @inheritDoc */
    initialize: function() {
      /**
       * @private
       * @type {Array.{Object}
       */
      this.tagUndos_ = [];
    },
    /** @inheritDoc */
    render: function() {
      var t;
      t = DM['extension/templates/undo.html'];
      this.$el.append(t());
      return this.$el;
    },
    /**
     * @param {string} tag
     * @param {Array.<string>} bookmarkIds
     */
    addTagUndo: function(tag, bookmarkIds) {
      this.tagUndos_.push({
        tag: tag,
        bookmarks: bookmarkIds
      });
    },
    /**
     * @param {Object} event
     * @private
     */
    handleUndo_: function(event) {
      event.preventDefault();
    },
    /**
     * @private
     */
    handleRemove_: function() {
      this.dispose();
    },
    /**
     * Dispose of this view.
     */
    dispose: function() {
      this.stopListening();
      this.$el.remove();
      this.trigger(Undo.Events.CLOSE);
    }
  });

  /**
   * @type {enum.<string>}
   */
  Undo.Events = {
    CLOSE: 'close'
  };

  return Undo;
});
