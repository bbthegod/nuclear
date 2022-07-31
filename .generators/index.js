const shell = require('shelljs');
const pageGenerator = require('./page');
const componentGenerator = require('./component');
module.exports = function plop(plop) {
  plop.addHelper('lowerCase', text => text.toLowerCase());
  plop.addHelper('getNameOfPage', text => {
    const str = text
      .split('/')
      .filter(path => path)
      .at(-1)
      .replaceAll('[', '')
      .replaceAll(']', '');
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('page', pageGenerator);
  plop.setActionType('prettify', (_, { data }) => {
    shell.exec(`npm run prettify -- "${data.path}"`, { silent: true });
    return;
  });
};
