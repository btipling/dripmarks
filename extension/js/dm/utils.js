/**
 * @fileOverview Utility functions for the extension.
 */
define([
  'underscore',
  './loading'
], function(_, loading) {

  function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
      if (!_.isUndefined(tab)) {
        chrome.tabs.remove(tab.id);
      }
    });
  }

  /**
   * @param {Dropbox.Datastore.Table} table
   */
  function clearAllRecords(table) {
    var records;
    records = table.query({});
    _.each(records, function(record) {
      var id;
      id = record.getId();
      record.deleteRecord();
    });
  }

  /**
   * This will kill any loading indicators added while loading on the
   * data store.
   * @param {Object} datastore
   */
  function manageSyncLoading(datastore) {
    datastore.syncStatusChanged.addListener(function() {
      var status;
      status = datastore.getSyncStatus();
      if (!status.uploading) {
        if (loading.isLoading(loading.namespaces.DATA_SYNC)) {
          loading.hideLoading(loading.namespaces.DATA_SYNC);
        }
      }
    });
  }

  return {
    closeTab: closeTab,
    clearAllRecords: clearAllRecords,
    manageSyncLoading: manageSyncLoading
  };
});
