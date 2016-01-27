var assert = require('assert');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var webfontPick = require('../');

function md5(file) {
  var hash = crypto.createHash('md5');

  hash.update(fs.readFileSync(path.resolve(__dirname, './output', file)));
  return hash.digest('hex');
}

describe('webfont-pick', function() {
  this.timeout(10e3);

  before(function(done) {
    webfontPick({
      font: path.resolve(__dirname, './fixtures/UbuntuMono-R.ttf'),
      text: 'Hello, World!',
      output: path.resolve(__dirname, './output')
    }, done);
  });

  it('svg', function() {
    assert.equal(md5('webfont.svg'), '35bbf9fbd952eb3a06b25d0e6409a006');
  });
});
