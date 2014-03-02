requirejs.config({
  paths: {
    jquery: '/js/extern/jquery-2.0.3',
    backbone: '/js/extern/backbone',
    underscore: '/js/extern/underscore',
    handlebars: '/js/extern/handlebars',
    templates: '/js/templates/templates',
    dropbox: 'https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest',
    bootstrapAlert: '/js/extern/bootstrap/alert',
    bootstrapModal: '/js/extern/bootstrap/modal'
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
    },
    bootstrapAlert: {
      exports: 'Alert'
    },
    bootstrapModal: {
      exports: 'Modal'
    }
  },
  baseUrl: '/js'
});

requirejs([
    'dm/browser'
], function(browser) {
  browser.main();
});

