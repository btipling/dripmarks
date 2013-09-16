/**
 * @fileOverview View for editing a bookmark.
 */
define([
  'templates',
  './bookmark_form'
], function(DM< BookmarkForm) {

  var BookmarkDialog;

  /**
   * @constructor
   * @extends {BookmarkForm}
   */
  BookmarkDialog = BookmarkForm.extend({
    template: DM['extension/templates/add_bookmark_form.html']
  });
});
