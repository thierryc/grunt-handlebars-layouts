/*
 * Grunt Handlebars-HTML
 * https://github.com/thierryc/grunt-handlebars-html
 *
 * Copyright (c) 2014 Thierry Charbonnel
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  var path = require("path");
  var fs = require("fs");
  var _ = require("lodash");
  var async = require("async");
  var chalk = require('chalk');
  var glob = require("glob");

  grunt.registerMultiTask("handlebarshtml", "Render Dust templates against a context to produce HTML", function() {
    var handlebars;
    var done = this.async();
    var partials = [];
    var opts = this.options({
      basePath: ".",
      defaultExt: ".hbs",
      whitespace: false,
      module: "handlebars",
      context: {},
      partials: []
    });

    // Require handlebars
    try {
      handlebars = require(opts.module);
    } catch(err) {
      grunt.fail.fatal("Unable to find the " + opts.module + " dependency. Did you npm install it?");
    }

    // Load includes/partials from the filesystem properly
    handlebars.onLoad = function(filePath, callback) {

      fs.readFile(filePath, "utf8", function(err, html) {
        if(err) {
          grunt.warn("Template " + err.path + " does not exist");
          return callback(err);
        }

        try {
          callback(null, html);
        } catch(err) {
          parseError(err, filePath);
        }
      });

    };

    if (this.files.length < 1) {
      grunt.verbose.warn('Destination not written because no source files were provided.');
    }

    if (typeof opts.partials === 'string') {
      opts.partials = [opts.partials];
    }
    opts.partials.push(opts.layout);
    opts.partials.push(opts.partials);

    if (opts.partials.length > 0) {
      opts.partials.forEach(function(partial){
        partial = String(partial);
        if (partial.indexOf('*') > 0 ) {
          // options is optional
          partials.push.apply(partials, glob.sync(partial, {cwd: opts.basePath}));
        } else {
          partials.push(partial);
        }
      });
    }

    async.each(partials, function(partial, callback) {
      var partialName = path.basename(partial, path.extname(partial));
      handlebars.registerPartial(partialName, grunt.file.read(opts.basePath + partial));
    }, done);

    async.each(this.files, function(f, callback) {
      f.src.forEach(function(srcFile) {
        var context = opts.context;
        var template, html;

        var getBlocks = function (context, name) {
            var blocks = context._blocks;
            return blocks[name] || (blocks[name] = []);
        };

        handlebars.registerHelper({
            extend: function (partial, options) {
              
                var context = Object.create(this);
                var template = handlebars.partials[partial];
              
              

                // Partial template required
                if (template == null) {
                    throw new Error('Missing layout partial: \'' + partial + '\'');
                }

                // New block context
                context._blocks = {};

                // Parse blocks and discard output
                options.fn(context);

                // Render final layout partial with revised blocks
                if (typeof template !== 'function') {
                    template = handlebars.compile(template);
                }

                // Compile, then render
                return template(context);
            },

            append: function (name, options) {
                getBlocks(this, name).push({
                    should: 'append',
                    fn: options.fn
                });
            },

            prepend: function (name, options) {
                getBlocks(this, name).push({
                    should: 'prepend',
                    fn: options.fn
                });
            },

            replace: function (name, options) {
                getBlocks(this, name).push({
                    should: 'replace',
                    fn: options.fn
                });
            },

            block: function (name, options) {
                var block = null;
                var retval = options.fn(this);
                var blocks = getBlocks(this, name);
                var length = blocks.length;
                var i = 0;

                for (; i < length; i++) {
                    block = blocks[i];

                    switch (block && block.fn && block.should) {
                        case 'append':
                            retval = retval + block.fn(this);
                            break;

                        case 'prepend':
                            retval = block.fn(this) + retval;
                            break;

                        case 'replace':
                            retval = block.fn(this);
                            break;
                    }
                }

                return retval;
            }
        });

        // preserve whitespace?
        // TODO

        // pre-compile the template
        try {
          template = handlebars.compile(grunt.file.read(srcFile));
        } catch(err) {
          parseError(err, srcFile);
        }

        // if context is a string assume it's the location to a file
        if (typeof opts.context === "string") {
          context = grunt.file.readJSON(opts.context);

        // if context is an array merge each item together
        } else if (Array.isArray(opts.context)) {
          context = {};

          opts.context.forEach(function(obj) {
            if(typeof obj === "string") {
              obj = grunt.file.readJSON(obj);
            }

            _.extend(context, obj);
          });
        }

        // render template and save as html
        html = template(context);
        grunt.file.write(f.dest, html);
        grunt.log.writeln('File "' + f.dest + '" created.');
      
      });
    }, done);
    
  });

  function parseError(err, filePath) {
    grunt.fatal("Error parsing handlebars template: " + err + " " + filePath);
  }
  

};
