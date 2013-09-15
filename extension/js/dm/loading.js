/**
 * @fileOverview Shows and hides loading mechanism. Needs a .progress somewhere.
 * Can be improved by specifing a containing element or something.
 */
define([
  'jquery',
  'underscore'
], function($, _) {

  var loadingCounts, DEFAULT_NAMESPACE, namespaces;

  /**
   * @type {Object.<string, number>}
   */
  loadingCounts = {};

  /**
   * @type [string}
   * @const
   */
  DEFAULT_NAMESPACE = 'default_';

  /**
   * @enum {string}
   */
  namespaces = {
    DATA_SYNC: 'datasync',
    DATASTORE: 'datastore',
    READABILITY: 'readability'
  };


  /**
   * @param {string=} opt_namespace
   */
  function showLoading(opt_namespace) {
    var ns;
    ns = opt_namespace || DEFAULT_NAMESPACE;
    if (!_.has(loadingCounts, ns)) {
      loadingCounts[ns] = 0;
    }
    loadingCounts[ns]++;
    $('.progress').show();
  }

  /**
   * @param {string=} opt_namespace
   * @return {boolean}
   */
  function isLoading(opt_namespace) {
    var ns;
    ns = opt_namespace || DEFAULT_NAMESPACE;
    return _.has(loadingCounts, ns) ? loadingCounts[ns] > 0 : false;
  }

  /**
   * @param {string=} opt_namespace
   */
  function hideLoading(opt_namespace) {
    var total, ns;
    ns = opt_namespace || DEFAULT_NAMESPACE;
    if (!_.has(loadingCounts, ns)) {
      // Let's never do that.
      throw 'Never loaded that.';
    }
    if (loadingCounts[ns] - 1 < 0) {
      // Let's never do this.
      throw 'Not loading this.';
    }
    loadingCounts[ns]--;
    _.each(loadingCounts, function(val) {
      total += val;
    });
    if (total < 0) {
      throw 'Loading is berked.';
    }
    if (!total) {
      $('.progress').hide();
    }
  }
  return {
    showLoading: showLoading,
    isLoading: isLoading,
    namespaces: namespaces,
    hideLoading: hideLoading
  };
});
