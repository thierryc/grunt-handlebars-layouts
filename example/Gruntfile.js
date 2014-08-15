/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  grunt.loadTasks('../tasks');

  grunt.initConfig({
    handlebarslayouts: {
      home: {
        files: {
          'dist/home.html': 'src/home.html'
        },
        options: {
          basePath: 'src/',
          partials: ['partials/*.hbs', 'layout.html'],
          modules: 'helpers/helpers-*.js',
          context: {
            title: 'Layout Test',
            items: [
              'apple',
              'orange',
              'banana'
            ]
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['handlebarslayouts']);
};
