#!/usr/bin/env node

/**
 * Script that runs as part of `npm version`. It updates any files that have a
 * reference to the current package version:
 *
 * - gradle.properties
 * x react-native-maps.podspec // <-- this is now dynamic
 * x react-native-google-maps.podspec // <-- this is now dynamic
 *
 * And `git add`s them.
 */

const { exec } = require('child_process');
const pkg = require('../package.json');

const filesToUpdate = ['gradle.properties'];

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

function updateVersionInFile(currentVersion, nextVersion, relativePath) {
  process.stdout.write(`• ${relativePath}\n`);
  return doExec(
    `sed -i '' 's/${escapeDots(currentVersion)}/${escapeDots(
      nextVersion
    )}/g' ./${relativePath}`
  );
}

function escapeDots(version) {
  return version.replace(/\./g, '\\.');
}

function run() {
  const currentVersion = pkg.version;
  const nextVersion = process.env.npm_package_version;

  Promise.resolve()
    .then(() => updateFiles(currentVersion, nextVersion))
    .then(() => gitAdd());
}

// Tasks

function updateFiles(currentVersion, nextVersion) {
  process.stdout.write(`Updating ${currentVersion} ➞ ${nextVersion}:\n`);
  return Promise.all(
    filesToUpdate.map(relativePath =>
      updateVersionInFile(currentVersion, nextVersion, relativePath)
    )
  );
}

function gitAdd() {
  return doExec(`git add ${filesToUpdate.join(' ')}`);
}

// Do it.

run();
