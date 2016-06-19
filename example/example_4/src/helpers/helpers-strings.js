/**
 * Handlebars Strings Helpers
 * Copyright (c) 2014 Thierry Charbonnel
 * Licensed under the MIT License (MIT).
 */
'use strict';

// The module to be exported
var helpers = {
  size: function (input) {
    return input ? input.length : 0;
  },

  downcase: function (input) {
    return typeof input === 'string' ? input.toLowerCase() : input;
  },

  upcase: function (input) {
    return typeof input === 'string' ? input.toUpperCase() : input;
  },

  capitalize: function (input) {
    return typeof input === 'string' ? input.charAt(0).toUpperCase() + input.slice(1) : input;
  },

  escape: function (input) {
    return escape(input);
  },

  slug: function (input) {
    if (!input || typeof input !== 'string') return input;
    return input.replace(/^\s+|\s+$/g, '').toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  }
};

// Export helpers
module.exports.register = function (Handlebars, options) {
  options = options || {};

  for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, helpers[helper]);
    }
  }
};