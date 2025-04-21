module.exports = {
  presets: [
    ['module:@react-native/babel-preset'],
    ['@babel/preset-typescript', {allowDeclareFields: true}], // to allow use of declare context
  ],
};
