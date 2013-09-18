define([
  'jquery',
  'underscore',
  'backbone',
  'templates',
  'bootstrapModal',
  './bookmark_dialog',
  './bookmark_form',
  './read'
], function($, _, Backbone, DM, Modal, BookmarkDialog, BookmarkForm, Read) {

  var Bookmarkslist;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  Bookmarkslist = Backbone.View.extend({
    /** @inheritDoc */
    events: {
      'click .bookmark-title':  'handleSelectBookmark_',
      'click .glyphicon-remove': 'handleRemove_',
      'click .glyphicon-edit': 'handleEdit_'
    },
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
    },
    /**
     * @param {Object} event
     * @private
     * @return {Bookmark}
     */
    getBookmarkFromEvent_: function(event) {
      var id, target, bookmark;
      target = event.target;
      bookmark = $(target).closest('.bookmark').get(0);
      id = bookmark.id;
      return this.model.get(id);
    },
    /**
     * @param {Object} event
     * @private
     */
    handleSelectBookmark_: function(event) {
      var bmid, bookmark, read;
      bmid = $(event.target).attr('data-for-id');
      bookmark = this.model.get(bmid);
      read = new Read({
        model: bookmark
      });
      read.render();
      $(document.body).append(read.$el);
    },
    /**
     * @param {Object} event
     * @private
     */
    handleRemove_: function(event) {
      var bookmark;
      bookmark = this.getBookmarkFromEvent_(event);
      bookmark.destroy();
    },
    /**
     * @param {Object} event
     * @private
     */
    handleEdit_: function(event) {
      var bookmark, bookmarkDialog;
      bookmark = this.getBookmarkFromEvent_(event);
      bookmarkDialog = new BookmarkDialog({model: bookmark});
      $(window.document.body).append(bookmarkDialog.render());
      $('#edit-bookmark').modal({
        backdrop: false
      });
      function destroyModal() {
        $('#edit-bookmark').modal('hide');
        $('.bookmark-dialog-container').remove();
      }
      bookmarkDialog.on(BookmarkForm.Event.CANCEL, destroyModal);
      bookmarkDialog.on(BookmarkForm.Event.CLOSE, destroyModal);
    },
  });

  return Bookmarkslist;
});
