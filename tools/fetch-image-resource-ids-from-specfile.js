'use strict';
var client = require('cheerio-httpcli');
var specUrl = 'http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/';

client.fetch(specUrl, function(err, $) {
  if (err) {
    throw err;
  }

  var $idsTable = $('caption:contains(Image resource IDs)').parent();
  var ids = {};
  $idsTable.find('tr').each(function(index) {
    if (index < 3) {
      return;
    }
    var cols = [];
    $(this).find('td').each(function() {
      cols.push($(this).text());
    });
    var id = cols[1].replace(/\s/g, ''); 
    var desc = cols[2].replace(/^\s*/, ''); 

    ids[id] = desc;
  });

  console.log(JSON.stringify(ids, null, 2));
});
