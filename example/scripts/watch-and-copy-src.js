const fs = require('fs-extra');
const watch = require('node-watch');
const rimraf = require('rimraf');

const packageName = 'react-native-maps/components';
const packagePath = '../components';

console.log(`Cleaning node_modules/${packageName}`);
rimraf(`node_modules/${packageName}`, () => {
  console.log(`Copying ${packageName}`);
  fs.copy(packagePath, `node_modules/${packageName}`, (err) => {
    if (err) return console.error(err);
  });

  console.log(`Watching ${packageName}`);
  watch(packagePath, (filename) => {
    const localPath = filename.split(packagePath).pop();
    const destination = `node_modules/${packageName}${localPath}`;
    console.log(`Copying ${filename} to ${destination}`);
    fs.copy(filename, destination, (err) => {
      if (err) return console.error(err);
    });
  });
});
