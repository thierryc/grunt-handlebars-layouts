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
  
  Handlebars.registerHelper('md', function(name, context){
    var result;
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
    return new Handlebars.SafeString(result); 
  });  
};
