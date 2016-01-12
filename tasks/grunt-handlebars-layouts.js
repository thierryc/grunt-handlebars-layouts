/*
 * Grunt Handlebars-HTML
 * https://github.com/thierryc/grunt-handlebars-layouts
 *
 * Copyright (c) 2014 Thierry Charbonnel
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var _ = require('lodash');
  var async = require('async');
  var chalk = require('chalk');
  var resolve = require('resolve-dep');

  grunt.registerMultiTask('handlebarslayouts', 'Render Handlebars templates against a context to produce HTML', function() {
    var handlebars;
    var done = this.async();
    var partials = [];
    var modules = [];
    var opts = this.options({
      engine: 'handlebars',
      basePath: '',
      defaultExt: '.hbs',
      whitespace: false,
      modules: [],
      context: {},
      partials: [],
      strict: false
    });

    // Require handlebars
    try {
      handlebars = require(opts.engine);
    } catch(err) {
      grunt.fail.fatal('Unable to find the Handlebars dependency. Did you npm install it?');
    }
    grunt.verbose.ok("Current engine:".green, opts.engine);

    // Load includes/partials from the filesystem properly
    handlebars.onLoad = function(filePath, callback) {

      fs.readFile(filePath, 'utf8', function(err, html) {
        if(err) {
          grunt.warn('Template ' + err.path + ' does not exist');
          return callback(err);
        }

        try {
          callback(null, html);
        } catch(err) {
          parseError(err, filePath);
        }
      });

    };

    if (typeof opts.modules === 'string') {
      opts.modules = [opts.modules];
    }

    if (opts.modules.length > 0) {
      opts.modules.forEach(function(module){
        module = String(module);
        if (module.indexOf('*') > 0 ) {
          modules.push.apply(modules, resolve(module));
        } else {
          modules.push(module);
        }
      });

      modules.forEach(function(module){
        // Require modules
        var mod, helpers;
        try {
          mod = require(module);
          if (typeof mod.register === 'function') {
            mod.register(handlebars, opts);
          } else { 
            helpers = mod();
            for (var helper in helpers) {
              if (helpers.hasOwnProperty(helper)) {
                handlebars.registerHelper(helper, helpers[helper]);
              }
            }
          }
        } catch(err) {
          grunt.fail.fatal('Unable to find the ' + module + ' dependency. Did you install it ?');
        }
      });
    }

    if (this.files.length < 1) {
      grunt.verbose.warn('Destination not written because no source files were provided.');
    }

    if (typeof opts.partials === 'string') {
      opts.partials = [opts.partials];
    }

    if (opts.partials.length > 0) {
      opts.partials.forEach(function(partial){
        partial = String(partial);
        if (partial.indexOf('*') > 0 ) {
          // options is optional
          partials.push.apply(partials, resolve(partial));
        } else {
          partials.push(partial);
        }
      });
      var partialsNames = [];
      partials.forEach(function(partial){
        var partialName = path.basename(partial, path.extname(partial));
        /*
        if(partialsNames[partialName]){
          parseError('\n' + chalk.red(partialName) +' basename already exist !\nPartial\'s basename (without extension) must be unique.\n', partialName);
        }
        */
        partialsNames[partialName] = true;
      });
    }

    partials.forEach(function(partial) {
    //async.each(partials, function(partial, callback) {
      var partialName = path.basename(partial, path.extname(partial));
      var partialFile = grunt.file.read(partial);
      try {
        handlebars.registerPartial(partialName, partialFile);
      } catch(err) {
        parseError(err, partial);
      }
    });

    this.files.forEach(function(filePair) {
    //async.each(this.files, function(filePair, callback) {

      var src = filePair.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        grunt.log.writeln(filepath);
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found.');
          return false;
        } else {
          return true;
        }
      });

      if (src.length === 0) {
        var err = 'Destination ' + chalk.cyan(filePair.dest) + ' not written because src files were empty.';
        grunt.log.warn(err);
        if (opts.strict) {
          parseError(err, filePair.dest);
        }
      }

      filePair.src.forEach(function(srcFile) {
        var template, html;
        var context = opts.context;

        var getBlocks = function (context, name) {
            var blocks = context._blocks;
            if (blocks === undefined) return [];
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
        
        // if context is an array merge each item together
        if (opts.context instanceof Array) {
          var contextFiles = [];
          opts.context.forEach(function(element, index, array) {
            if (element instanceof Object) {
              context = _.extend(context, element);
            } else {
              contextFiles.push.apply(contextFiles, resolve(element));
            }
          });
          contextFiles.forEach(function(element, index, array) {
            context = _.extend(context, grunt.file.readJSON(element));
          });
        } else if (typeof opts.context === 'string') {
          context = grunt.file.readJSON(resolve(opts.context));
        }

        // render template and save as html
        html = template(context);
        var dest = filePair.dest;
        if (filePair.dest.indexOf('*') > 0 ) {
          var fileName = path.basename(srcFile, path.extname(srcFile));
          dest = filePair.dest.replace('*', fileName);
        }
        grunt.file.write(dest, html);
        grunt.log.writeln('File "' + dest + '" ' + 'created.'.green);

      });
    });
    done();
  });

  function parseError(err, filePath) {
    grunt.fatal('Error parsing handlebars template: ' + err + ' ' + filePath);
  }
};
