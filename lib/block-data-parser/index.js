'use strict';
var parsePascalString = require('./pascal-string');
var parseUnicodeString = require('./unicode-string');
var parseHex = require('./hex');
var parseUTF8 = require('./utf8');

module.exports = {
  // Names of the alpha channels
  '1006': parsePascalString,

  // (Photoshop 5.0) Unicode Alpha Names.
  '1045': parseUnicodeString,

  // (Photoshop 7.0) XMP metadata.
  '1060': parseUTF8,

  // (Photoshop 7.0) Caption digest.
  '1061': parseHex,
  
  // (Photoshop 7.0) Print scale.
  '1062': require('./1062')
};
