/**
 * @fileOverview Just attempts to auth if not authed.
 */
define([
  './auth'
], function(auth) {

  function main() {
    auth.auth();
  }

  return {
    main: main
  };
});
