/**
 * @fileOverview View for editing a bookmark.
 */
define([
  'templates',
  './bookmark_form'
], function(DM, BookmarkForm) {

  var BookmarkDialog;

  /**
   * @constructor
   * @extends {BookmarkForm}
   */
  BookmarkDialog = BookmarkForm.extend({
    className: 'bookmark-dialog-container',
    template: DM['extension/templates/edit_bookmark_dialog.html']
  });

  return BookmarkDialog;
});
