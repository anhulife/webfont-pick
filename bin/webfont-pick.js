#!/usr/bin/env node

var _ = require('lodash');
var argv = require('yargs')
  .options({
    f: {
      alias: 'font',
      describe: '源字体文件路径',
      type: 'string',
      required: true
    },

    t: {
      alias: 'text',
      describe: '挑选的文字',
      type: 'string',
      required: true
    },

    n: {
      alias: 'fontName',
      describe: '目标字体名称，默认为 webfont',
      type: 'string'
    },

    c: {
      alias: 'className',
      describe: '目标样式名称，默认为 web-font',
      type: 'string'
    },

    o: {
      alias: 'output',
      describe: '输出目录，默认为当前目录',
      type: 'string'
    }
  })
  .help('help')
  .argv;

var options = _.pick(argv, ['font', 'text', 'fontName', 'className', 'output']);

require('../')(options, function(err) {
  process.exit(err ? 1 : 0);
});
