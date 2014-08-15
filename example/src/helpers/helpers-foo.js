/**
 * Handlebars Foo Helpers
 * Copyright (c) 2014 Thierry Charbonnel
 * Licensed under the MIT License (MIT).
 */
'use strict';


// node_modules
var _ = require('lodash');


// The module to be exported
var helpers = {

  foo: function (value) {
    return value + 1;
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
