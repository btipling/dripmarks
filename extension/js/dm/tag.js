/**
 * @fileOverview A model representing a tag.
 */
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var Tag;

  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  Tag = Backbone.Model.extend({
    defaults: {
      tagName: 'No name'
    }
  });

  return Tag;

});
