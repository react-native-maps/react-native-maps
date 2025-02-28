const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = getConfig(
  {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        '@babel/plugin-transform-typescript',
        {
          /// TODO: remove this override
          allowDeclareFields: true,
        },
      ],
    ],
  },
  { root, pkg }
);
