var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

// 工具集
var util = require('./util');

// 字体文件生成器
var generate = require('./generate');

// 示例模版
var demoTemplate = _.template(
  fs.readFileSync(path.resolve(__dirname, './template.html'), { encoding: 'utf-8' })
);

function prepare(options) {
  options = _.assign({
    fontName: 'webfont',
    className: 'web-font',
    output: path.resolve('.')
  }, options);

  if (!_.has(options, 'font')) {
    throw new Error('缺少源字体设置');
  }

  // 准备目录
  mkdirp.sync(util.getDestPath(options));

  return options;
}

function webfont(options, callback) {
  options = prepare(options);

  generate(options, function(err) {
    if (err) {
      return callback(err);
    }

    var demo = demoTemplate(_.pick(options, ['fontName', 'className', 'text']));
    fs.writeFileSync(util.getDemoPath(options), demo, { encoding: 'utf-8' });

    callback();
  });
}

module.exports = webfont;
