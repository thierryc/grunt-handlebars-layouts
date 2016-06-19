/**
 * Handlebars MD5 Helpers
 * Copyright (c) 2014 Thierry Charbonnel
 * Licensed under the MIT License (MIT).
 */
'use strict';

var crypto = require('crypto'),
    fs = require('fs');

// The module to be exported
var helpers = {
  md5: function (path) {
    var content = fs.readFileSync(path);
    return crypto.createHash('md5').update(content).digest('hex');
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

