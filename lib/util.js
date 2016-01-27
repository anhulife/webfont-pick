var path = require('path');

function getDemoPath(opitons) {
  return path.resolve(opitons.output, 'demo.html');
}

function getFontPath(options, type) {
  return path.resolve(options.output, options.fontName + '.' + type);
}

function getDestPath(options) {
  return path.resolve(options.output);
}

module.exports = {
  getDemoPath: getDemoPath,
  getFontPath: getFontPath,
  getDestPath: getDestPath
};
