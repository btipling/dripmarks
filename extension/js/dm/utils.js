/**
 * @fileOverview Utility functions for the extension.
 */
define([
], function() {

  function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  }

  return {
    closeTab: closeTab
  };
});
