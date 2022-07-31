const fs = require('fs');
const path = require('path');

function pathExists(path) {
  return fs.existsSync(path);
}

const baseGeneratorPath = path.join(__dirname, '../..');

module.exports = {
  pathExists,
  baseGeneratorPath,
};
