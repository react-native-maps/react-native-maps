#!/usr/bin/env node

/*

* Get current npm version.
* Determine what type of version bump: major, minor, patch
* Update the files:
  * package.json
  * android/gradle.properties
  * react-native-maps.podspec
  * react-native-google-maps.podspec
* Make Git commit.
* Create Git tag.

*/

// TODO: update eslint-plugin-import so we can configure
// `import/no-extraneous-dependencies` to allow devDependencies in `scripts/`.

const { exec } = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const commander = require('commander');
// eslint-disable-next-line import/no-extraneous-dependencies
const dedent = require('dedent');
// eslint-disable-next-line import/no-extraneous-dependencies
const semver = require('semver');
const pkg = require('../package.json');

const versionTypes = ['major', 'minor', 'patch'];
const filesToUpdate = [
  'package.json',
  'android/gradle.properties',
  'react-native-maps.podspec',
  'react-native-google-maps.podspec',
];

commander
  .version(pkg.version)
  .arguments('<versionType>')
  .action(versionType => {
    if (!versionTypes.includes(versionType)) {
      die(dedent`Version type "${versionType}" not recognized.
                Supported values: ${versionTypes.map(v => `"${v}"`).join(', ')}.`);
    }
    bumpVersion(pkg.version, versionType).catch(err => {
      process.stderr.write(`${err.stack}\n`);
    });
  });

commander.parse(process.argv);

function die(message) {
  process.stderr.write(message);
  process.exit(1);
}

function doExec(cmdString) {
  return new Promise((resolve, reject) => {
    exec(cmdString, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
}

function bumpVersion(currentVersion, versionType) {
  const nextVersion = semver.inc(currentVersion, versionType);
  process.stdout.write(`Updating version from ${currentVersion} to ${nextVersion}...\n`);

  return Promise.resolve()
    .then(() => updateFiles(currentVersion, nextVersion))
    .then(() => createCommit(nextVersion))
    .then(() => createTag(nextVersion))
  ;
}

function updateFiles(currentVersion, nextVersion) {
  return Promise.all(filesToUpdate.map(relativePath =>
    updateVersionInFile(currentVersion, nextVersion, relativePath)
  ));
}

function createCommit(nextVersion) {
  return doExec(`git commit -am ${nextVersion}`);
}

function createTag(nextVersion) {
  return doExec(`git tag v${nextVersion}`);
}

function updateVersionInFile(currentVersion, nextVersion, relativePath) {
  process.stdout.write(`-> ${relativePath}\n`);
  return doExec(`sed -i '' 's/${
    escapeDots(currentVersion)
  }/${
    escapeDots(nextVersion)
  }/g' ./${relativePath}`);
}

function escapeDots(version) {
  return version.replace(/\./g, '\\.');
}
