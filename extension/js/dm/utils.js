/**
 * @fileOverview Utility functions for the extension.
 */
define([
  'underscore'
], function(_) {

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

  return {
    closeTab: closeTab,
    clearAllRecords: clearAllRecords
  };
});
