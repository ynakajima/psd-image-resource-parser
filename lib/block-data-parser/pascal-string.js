'use strict';
var getPascalString = require('../get-pascal-string');

// return pascal strings
module.exports = function(buffer) {
  return getPascalString(buffer, 0);
};

