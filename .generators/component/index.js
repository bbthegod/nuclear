/*
 *
 * Component Generator
 *
 */
const { pathExists, baseGeneratorPath } = require('../utils/commons');

module.exports = {
  description: 'Generate a component.',
  prompts: [
    {
      type: 'input',
      name: 'componentName',
      message: 'What should it be called?',
      validate: value => {
        if (/.+/.test(value)) {
          const actualComponentPath = `${baseGeneratorPath}/components/${value}`;
          return pathExists(actualComponentPath) ? 'Components already exists!' : true;
        }
        return 'This field is required!';
      },
    },
  ],
  actions: () => {
    const componentPath = `${baseGeneratorPath}/components/{{properCase componentName}}`;
    const actions = [
      {
        type: 'add',
        path: `${componentPath}/index.tsx`,
        templateFile: './component/index.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'prettify',
        data: { path: `${componentPath}/**` },
      },
    ];
    return actions;
  },
};
