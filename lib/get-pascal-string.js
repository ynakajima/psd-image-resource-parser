'use strict';
/**
 * get PASCAl string from jDataView
 * @param {jDataView} view
 * @param {number} offset [optional]
 * @return {string}
 */
function getPascalString(view, offset) {
  if (Buffer.isBuffer(view)) {
    offset = offset||0;
    var _length = view.readUInt8(offset); 
    var _string = view.toString('ascii', offset + 1, _length + 1);
    return _string;
  }
  if (typeof offset === 'number') {
    view.seek(offset);
  }
  var length = view.getUint8();
  var string = view.getString(length);
  var pad = (length + 1) % 2;
  view.seek(view.tell() + pad);
  return string;
}

module.exports = getPascalString;
