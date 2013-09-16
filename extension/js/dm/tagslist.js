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
  TagsList = Backbone.View.extend({
    /** @inheritDoc */
    events: {
      'click .tag': 'handleSelectTag_',
      'click .glyphicon-sort-by-alphabet': 'handleSortByAlpha_',
      'click .glyphicon-sort-by-alphabet-alt': 'handleSortByAlphaAlt_',
      'click .glyphicon-sort-by-attributes': 'handleSortByAtr_',
      'click .glyphicon-sort-by-attributes-alt': 'handleSortByAtrAlt_'
    },
    /** @inheritDoc */
    initialize: function() {
      this.listenTo(this.model, 'all', this.render);
      this.listenTo(this.model, 'sort', this.render);
      this.model.comparator = this.model.numTagsComparator;
      this.model.fetch();
    },
    /** @inheritDoc */
    render: function() {
      var t, context;
      t = DM['extension/templates/tags_list.html'];
      context = this.model.toJSON();
      this.$el.html(t(_.filter(context, function(tag) {
        return !_.isEmpty(tag.bookmarks);
      })));
      return this.$el;
    },
    /**
     * @param {Object} event
     * @private
     */
    handleSelectTag_: function(event) {
      var id, bookmarks;
      id = event.target.id;
      bookmarks = this.model.get(id).get('bookmarks');
      this.options.bookmarks.setIds(bookmarks);
    },
    /**
     * @private
     */
    handleSortByAlpha_: function() {
      this.model.comparator = this.model.alphaComparator;
      this.model.sort();
    },
    /**
     * @private
     */
    handleSortByAlphaAlt_: function() {
      this.model.comparator = this.model.alphaComparatorAlt;
      this.model.sort();
    },
    /**
     * @private
     */
    handleSortByAtr_: function() {
      this.model.comparator = this.model.numTagsComparator;
      this.model.sort();
    },
    /**
     * @private
     */
    handleSortByAtrAlt_: function() {
      this.model.comparator = this.model.numTagsComparatorAlt;
      this.model.sort();
    }
  });

  return TagsList;
});
