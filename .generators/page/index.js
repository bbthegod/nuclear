/*
 *
 * Page Generator
 *
 */
const { pathExists, baseGeneratorPath } = require('../utils/commons');

module.exports = {
  description: 'Generate a page.',
  prompts: [
    {
      type: 'input',
      name: 'path',
      message: 'What is the path of this page?\n- Example: /path/to/page/[dynamic]\n',
      validate: value => {
        if (/.+/.test(value)) {
          const actualPagePath = `${baseGeneratorPath}/pages/${value}`;
          return pathExists(actualPagePath) ? 'Page already exists!' : true;
        }
        return 'This field is required!';
      },
    },
  ],
  actions: () => {
    const pagePath = `${baseGeneratorPath}/pages/{{lowerCase path}}`;
    const actions = [
      {
        type: 'add',
        path: `${pagePath}/index.tsx`,
        templateFile: `./page/index.tsx.hbs`,
        abortOnFail: true,
      },
      {
        type: 'prettify',
        data: { path: `${pagePath}/**` },
      },
    ];
    return actions;
  },
};
