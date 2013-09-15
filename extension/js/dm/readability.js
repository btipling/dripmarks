define([
  'jquery',
  'underscore',
  './readability_api_keys',
  './bookmark',
  './loading'
], function($, _, keys, Bookmark, loading) {

  var API_URL;

  /**
   * @type {string}
   * @const
   */
  API_URL = 'https://readability.com/api/content/v1/parser';

  /**
   * Populate a bookmark with info from the readability
   * API.
   * @param {string} url The URL to give to readability.
   * @param {Bookmark=} opt_bookmark The bookmark to populate. If not given
   *   a new one is created.
   * @param {Function=} opt_callback An optional callback when finished. It is
   * is given the bookmark as an argument.
   */
  function populateBookmark(url, opt_bookmark, opt_callback) {
    loading.showLoading();
    $.ajax({
      url: API_URL,
      data: {url: url, token: keys.parserToken},
      success: function(data) {

        var bookmark;

        bookmark = opt_bookmark || new Bookmark();
        bookmark.set(_.extend(data, {contentAvailable: true}));
        loading.hideLoading();
        if (opt_callback && _.isFunction(opt_callback)) {
          opt_callback(bookmark);
        }
      },
      error: function() {

        var bookmark;

        bookmark = opt_bookmark || new Bookmark();
        loading.hideLoading();
        if (opt_callback && _.isFunction(opt_callback)) {
          opt_callback(bookmark);
        }
      }
    });
  }

  return {
    populateBookmark: populateBookmark
  };
});
