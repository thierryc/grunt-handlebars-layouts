/*global module:false*/
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
  
    handlebarslayouts: {
      dev: {
        files: {
          //'dist/home.html': 'src/home.html'
          'dist/*.html': 'src/*.hsb'
        },
        options: {
          partials: ['src/partials/*.hbs', 'src/partials/*.md', 'src/layout.html'],
          basePath: 'src/',
          modules: ['src/helpers/helpers-*.js', 'handlebars-helper-moment'],
          context: {
            title: 'Layout Test',
            projectName: 'Grunt handlebars layout',
            items: [
              'apple',
              'orange',
              'banana'
            ]
          }
        }
      }
    },
    
    connect: {
      server: {
        options: {
          livereload: true,
          port: 8000,
          base:'dist/',
          open: true
        }
      }
    },
    
    watch: {
      layout: {
        files: 'src/layout.html',
        tasks: 'handlebarslayouts:dev'
      },
      hsb: {
        files: 'src/**/*.hsb',
        tasks: 'handlebarslayouts:dev'
      },
      options: {
        livereload: true
      }
    },
    
  });
  
  grunt.loadTasks('../../tasks');
  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['handlebarslayouts']);
  
  grunt.registerTask('serve', ['handlebarslayouts', 'connect:server', 'watch']);
  
};
