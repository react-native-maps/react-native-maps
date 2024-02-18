const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: [
    ['module:@react-native/babel-preset'],
    ['@babel/preset-typescript', {allowDeclareFields: true}], // to allow use of declare context
  ],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak.name]: path.join(__dirname, '..', pak.source),
        },
      },
    ],
  ],
};
