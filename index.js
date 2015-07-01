'use strict';
var jDataView = require('jdataview');
var fs = require('fs');
var ImageResourceBlock = require('./lib/image-resource-block');
var COLORMODE_OFFSET = 26;

/**
 * parse by filepath
 */
function parse(filePath, callback) {
  fs.readFile(filePath, 'binary', function(err, file) {
    if (err) {
      return callback(err);
    }

    try {
      var imageResource = parseBuffer(file);
      callback(null, imageResource);
    } catch(err) {
      callback(err);
    }
  });
}

/**
 * parse by buffer
 */
function parseBuffer(buf) {
  var view = jDataView(buf);
  if (!isPSD(view)){
    throw new Error('Invalid PSD file');
  }
  
  // get image resource offset
  var colormodeLength = view.getUint32(COLORMODE_OFFSET) + 4;
  var offset = colormodeLength + COLORMODE_OFFSET;

  // parse image resource
  var imageResource = parseImageResource_(view, offset);
  return imageResource;
}

function isPSD(view) {
  // read signature
  var signature = view.getString(4);
  return signature === '8BPS';
}

function parseImageResource_(view, offset) {
  view.seek(offset);

  // get length
  var length = view.getUint32();
  var endOffset = offset + 4 + length;

  // parse image resource blocks
  var blockOffset = offset + 4;
  var blocks = [];
  try {
    while(blockOffset < endOffset) {
      var block = ImageResourceBlock.parse(view, blockOffset);
      blocks.push(block);
      blockOffset += block.getLength();
    }
  } catch (err) {
    throw new Error([
      err.message,
      'blockOffset=' + blockOffset,
      'blocks=' + JSON.stringify(blocks)
    ].join(' : '));
  }

  return {
    _startOffset: offset,
    _endOffset: endOffset,
    length: length,
    imageResourceBlocks: blocks
  };
}

module.exports = {
  parse: parse,
  parseBuffer: parseBuffer,
  isPSD: isPSD
};

if (!module.parent) {
  var filePath = process.argv[2];
  parse(filePath, function(err, imageResource) {
    if (err) {
      throw err;
    }
    console.log(JSON.stringify(imageResource, null, 2));
  });
}
