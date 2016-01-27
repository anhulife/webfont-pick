var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var opentype = require('opentype.js');
var path = require('path');
var Readable = require('stream').Readable;
var StringDecoder = require('string_decoder').StringDecoder;
var svgicons2svgfont = require('svgicons2svgfont');
var svg2ttf = require('svg2ttf');
var ttf2woff = require('ttf2woff');
var ttf2eot = require('ttf2eot');

var util = require('./util');

// 示例模版
var svgTemplate = _.template(
  fs.readFileSync(path.resolve(__dirname, './template.svg'), { encoding: 'utf-8' })
);

module.exports = function(options, callback) {
  var fonts = {};

  var generator = {
    svg: function(callback) {
      opentype.load(path.resolve(options.font), function(err, font) {
        if (err) {
          return callback(err);
        }

        var svgFont = '';

        var fontStream = svgicons2svgfont({
          fontName: options.fontName,
          fontHeight: font.unitsPerEm,
          descent: font.descender,
          log: _.noop
        });

        // 解码
        var decoder = new StringDecoder('utf8');
        fontStream.on('data', function(chunk) {
          svgFont += decoder.write(chunk);
        });

        fontStream.on('end', function() {
          fonts.svg = svgFont;
          callback(null, svgFont);
        });

        var glyghs = font.stringToGlyphs(options.text);

        glyghs = _.uniqBy(glyghs, 'index');

        glyghs.forEach(function(glyph) {
          var svgReadable = new Readable();

          svgReadable.push(svgTemplate({
            width: font.unitsPerEm,
            height: font.unitsPerEm,
            svg: glyph.getPath(0, font.ascender - font.descender, font.unitsPerEm).toSVG()
          }));
          svgReadable.push(null);

          svgReadable.metadata = {
            unicode: [String.fromCharCode(glyph.unicode)],
            name: '' + glyph.index
          };

          fontStream.write(svgReadable);
        });

        fontStream.end();
      });
    },

    ttf: function(callback) {
      getFont('svg', function(err, svgFont) {
        if (err) {
          return callback(err);
        }

        fonts.ttf = new Buffer(svg2ttf(svgFont, {}).buffer);
        callback(null, fonts.ttf);
      });
    },

    woff: function(callback) {
      getFont('ttf', function(err, ttfFont) {
        if (err) {
          return callback(err);
        }

        fonts.woff = new Buffer(ttf2woff(new Uint8Array(ttfFont), {}).buffer);
        callback(null, fonts.woff);
      });
    },

    eot: function(callback) {
      getFont('ttf', function(err, ttfFont) {
        if (err) {
          return callback(err);
        }

        fonts.eot = new Buffer(ttf2eot(new Uint8Array(ttfFont)).buffer);
        callback(null, fonts.eot);
      });
    }
  };

  function getFont(type, callback) {
    if (fonts[type]) {
      callback(null, fonts[type]);
    } else {
      generator[type](callback);
    }
  }

  function createFontWriter(type) {
    return function(callback) {
      getFont(type, function(err, font) {
        if (err) {
          return callback(err);
        }

        fs.writeFileSync(util.getFontPath(options, type), font);
        callback();
      });
    };
  }

  var tasks = [];
  (['svg', 'ttf', 'woff', 'eot']).forEach(function(type) {
    tasks.push(createFontWriter(type));
  });

  async.series(tasks, callback);
};
