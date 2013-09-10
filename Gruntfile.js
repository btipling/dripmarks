module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'extension/js/dripmarks/**/*.js'],
      options: {
        curly: true,
        unused: true,
        onevar: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
    }
  });


  grunt.registerTask('default', ['jshint']);
  grunt.loadNpmTasks('grunt-contrib-jshint');

};
