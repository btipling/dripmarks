module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'extension/js/popup.js',
        'extension/js/browser.js',
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
          requirejs: false,
          define: false,
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
          'extension/css/browser.css': 'extension/less/browser.less'
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
          namespace: 'DM'
        },
        files: {
          'extension/js/templates/templates.js': 'extension/templates/*.html'
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: './build.zip'
        },
        files: [
          {cwd: 'extension/js', expand: true, src: ['**'], dest: 'js/'},
          {cwd: 'extension/css/', expand: true, src: ['**'], dest: 'css/'},
          {cwd: 'extension/html/', expand: true, src: ['**'], dest: 'html/'},
          {cwd: 'extension/images/', expand: true, src: ['**'],
            dest: 'images/'},
          {cwd: 'extension/fonts/', expand: true, src: ['**'], dest: 'fonts/'},
          {cwd: 'extension/', expand: true, src: ['./manifest.json'],
            dest: '.'}
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['jshint', 'handlebars', 'less']);
  grunt.registerTask('build', ['default', 'compress']);

};
