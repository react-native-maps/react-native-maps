// release.js
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Path to the lib package
const libDir = path.join(__dirname, 'packages/lib');
const packageJsonPath = path.join(libDir, 'package.json');

// Function to handle workspace dependencies before semantic-release
function prepareForRelease() {
  console.log('Preparing package.json for semantic-release...');

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const originalDeps = {
    dependencies: {...packageJson.dependencies},
    devDependencies: {...packageJson.devDependencies},
    peerDependencies: {...packageJson.peerDependencies},
  };

  fs.writeFileSync(
    path.join(libDir, '.package.json.bak'),
    JSON.stringify(originalDeps, null, 2),
  );

  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (!packageJson[depType]) return;
    Object.keys(packageJson[depType]).forEach(dep => {
      const version = packageJson[depType][dep];
      if (version.startsWith('workspace:')) {
        packageJson[depType][dep] = '*';
      }
    });
  });

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Package.json prepared for semantic-release');
}

function restoreAfterRelease() {
  console.log('Restoring workspace dependencies...');
  const backupPath = path.join(libDir, '.package.json.bak');
  if (fs.existsSync(backupPath)) {
    const originalDeps = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (originalDeps[depType]) {
        packageJson[depType] = originalDeps[depType];
      }
    });

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    fs.unlinkSync(backupPath);
    console.log('Workspace dependencies restored');
  }
}

async function main() {
  try {
    prepareForRelease();
    console.log('Running semantic-release from lib...');

    const semanticReleasePath = path.join(
      libDir,
      'node_modules',
      '.bin',
      'semantic-release',
    );

    execSync(semanticReleasePath, {
      stdio: 'inherit',
      cwd: libDir, // run from lib directory
      env: {
        ...process.env,
      },
    });
  } catch (error) {
    console.error('Error during release:', error);
    process.exitCode = 1;
  } finally {
    restoreAfterRelease();
  }
}

main();
