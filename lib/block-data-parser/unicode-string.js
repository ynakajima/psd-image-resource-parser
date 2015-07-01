'use strict';
require('string.fromcodepoint');

// return UNICODE strings
module.exports = function(buffer) {
  var length = buffer.readUInt32BE(0);
  var strings = [];
  for (var i = 0; i < length; i++) {
    var codePoint = buffer.readUInt16BE(4 + (i * 2));
    strings.push(String.fromCodePoint(codePoint));
  }
  return strings.join('');
};

