requirejs.config({
  paths: {
    jquery: '/js/extern/jquery-2.0.3',
    backbone: '/js/extern/backbone',
    underscore: '/js/extern/underscore',
    handlebars: '/js/extern/handlebars',
    templates: '/js/templates/templates',
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
    },
    templates: {
      deps: ['handlebars'],
      exports: 'DM'
    }
  },
  baseUrl: '/js'
});

requirejs([
    'dm/popup'
], function(popup) {
  popup.main();
});

