/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  grunt.loadTasks("../tasks");

  grunt.initConfig({
    handlebarshtml: {
      home: {
        files: {
          "dist/home.html": "src/home.html"
        },
        options: {
          basePath: "src/",
          partials: "partials/*.hbs",
          layout: "layout.html",
          context: {
            title: "Layout Test",
            items: [
              "apple",
              "orange",
              "banana"
            ]
          }
        }
      }
    }
  });

  grunt.registerTask("default", ["handlebarshtml"]);
};
