module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'extension/js/popup.js',
        'extension/js/dm/**/*.js'
      ],
      options: {
        curly: true,
        undef: true,
        unused: true,
        onevar: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          requirejs: false,
          define: false,
          Dropbox: false,
          chrome: false,
          module: false
        },
      },
    },
    less: {
      compile: {
        options: {
          paths: ['static/less'],
          yuicompress: false
        },
        files: {
          'extension/css/popup.css': 'extension/less/popup.less',
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          partialsUseNamespace: false,
          processPartialName: function(filepath) {
            var pieces, filename;
            pieces = filepath.split('/');
            filename = pieces[pieces.length - 1];
            pieces = filename.split('.');
            return pieces[0];
          },
          partialRegex: /^par_/,
          namespace: 'LTT'
        },
        files: {
          'extension/js/templates/templates.js': 'extension/templates/*.html'
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.registerTask('default', ['jshint', 'handlebars', 'less']);

};
