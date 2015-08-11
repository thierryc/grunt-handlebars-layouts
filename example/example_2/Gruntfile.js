/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  grunt.loadTasks('../../tasks');

  grunt.initConfig({
    handlebarslayouts: {
      home: {
        files: {
          //'dist/home.html': 'src/home.html'
          'dist/*.html': 'src/*.hsb'
        },
        options: {
          partials: ['src/partials/*.hbs', 'src/partials/*.md', 'src/layout.html'],
          basePath: 'src/',
          modules: ['src/helpers/helpers-*.js', 'handlebars-helper-moment'],
          context: ['src/pages/**/*.json']
        }
      }
    }
  });

  grunt.registerTask('default', ['handlebarslayouts']);
};
