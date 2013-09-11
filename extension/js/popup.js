requirejs.config({
  paths: {
    jquery: '/js/extern/jquery-2.0.3',
    backboune: '/js/extern/backbone',
    underscore: '/js/extern/underscore',
    dropbox: 'https://www.dropbox.com/static/api/1/dropbox-datastores-0.1.0-b4'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    dropbox: {
      exports: 'Dropbox'
    },
    underscore: {
      exports: '_'
    }
  },
  baseUrl: '/js'
});

requirejs([
    'dm/popup'
], function(popup) {
  popup.main();
});

