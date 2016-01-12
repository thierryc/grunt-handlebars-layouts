/**
 * Handlebars Markdown Helpers
 * Copyright (c) 2014 Thierry Charbonnel
 * Licensed under the MIT License (MIT).
 */
'use strict';

var marked = require('marked');

// Export helpers
module.exports.register = function (Handlebars, options) {
  options = options || {};
  options.marked = options.marked || {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  };
  
  var context = options.context;
  
  Handlebars.registerHelper('md', function(name, options){
    var result, template;
    marked.setOptions(options.marked);
    // Convert inline markdown by prepending the name string with `:`
    if(name.match(/^:/)) {
      result = marked(name.replace(/^:/, ''));
    } else {
      try {
        result = marked(Handlebars.partials[name]);
      } catch(err) {
        result = '<!-- error -->'; 
      }
    }
    template = Handlebars.compile(result);
    return new Handlebars.SafeString(template(context));
  });  
};
