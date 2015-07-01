'use strict';
// (Photoshop 7.0) Print scale.
// 2 bytes style (0 = centered, 1 = size to fit, 2 = user defined).
// 4 bytes x location (floating point).
// 4 bytes y location (floating point).
// 4 bytes scale (floating point)
module.exports = function(buffer) {
  var styles = ['centered', 'size to fit', 'user defined'];
  return {
    style: styles[buffer.readUInt16BE(0)],
    x: buffer.readFloatBE(2),
    y: buffer.readFloatBE(6),
    scale: buffer.readFloatBE(10)
  };
};

