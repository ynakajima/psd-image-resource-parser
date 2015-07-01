'use strict';
var types = require('../image-resource-ids.json');
var getPascalString = require('./get-pascal-string');
var blockDataParsers = require('./block-data-parser');

/**
 * ImageResourceBlock class
 */
function ImageResourceBlock(params) {
  this.params = params;
  this.data = new Buffer(0);
}

// UNIMPLEMENTED
ImageResourceBlock.UNIMPLEMENTED = 'UNIMPLEMENTED';

// UNSUPPORTED
ImageResourceBlock.UNSUPPORTED = 'UNSUPPORTED';

/**
 * parse image resource block
 */
ImageResourceBlock.parse = function(view, offset) {
  view.seek(offset);

  // get signature
  var signature = view.getString(4);
  if (signature !== '8BIM') {
    throw new Error('Invalid Image Resource Block');
  }

  // get ID
  var id = view.getUint16();
  
  // get name
  var name = getPascalString(view);

  // actual data size
  var actualSize = view.getUint32();
  var actualDataOffset = view.tell();

  // padded to make the size even
  var length = (actualDataOffset + actualSize) - offset;
  length += length % 2;
  
  // create object
  var block = new ImageResourceBlock({
    _startOffset: offset,
    _endOffset: offset + length,
    _length: length,
    _type: ImageResourceBlock.getType(id),
    signature: signature,
    id: id,
    name: name,
    actualSize: actualSize,
    actualData: {}
  });
  
  // parse data
  block.data = view.buffer.slice(
    actualDataOffset, actualDataOffset + actualSize);
  var blockDataParser = blockDataParsers[id.toString()];
  if (typeof blockDataParser === 'function') {
    block.params.actualData = blockDataParser(block.data);
  } else {
    block.params.actualData = ImageResourceBlock.UNIMPLEMENTED;
  } 
  return block;
};

ImageResourceBlock.TYPES = types;

/**
 * get image resource block type by id
 */
ImageResourceBlock.getTypeDescription = function(id) {
  id = id.toString(10);
  if (typeof types[id] !== 'undefined') {
    return types[id];
  }
  id = Number(id);
  for (var key in types) {
    if (key.match(/\-/)) {
      var range = key.split('-').map(Number);
      if (range[0] <= id && id <= range[1]) {
        return types[key];
      }
    }
  }
  return '(unknown)';
};

ImageResourceBlock.getType = function(id) {
  var desc = ImageResourceBlock.getTypeDescription(id);
  return desc.replace(/\. .*/, '');
};

ImageResourceBlock.prototype.getLength = function() {
  return this.params._length;
};

ImageResourceBlock.prototype.getType = function() {
  return this.params._type;
};

ImageResourceBlock.prototype.getTypeDescription = function() {
  return ImageResourceBlock.getTypeDescription(this.params.id);
};

ImageResourceBlock.prototype.toJSON = function() {
  return this.params;
};

// exports
module.exports = ImageResourceBlock;
