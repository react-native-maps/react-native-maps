// release.js
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Path to the package.json in the lib directory
const packageJsonPath = path.join(__dirname, 'packages/lib/package.json');

// Function to handle workspace dependencies before semantic-release
function prepareForRelease() {
  console.log('Preparing package.json for semantic-release...');

  // Read the package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Store original dependencies
  const originalDeps = {
    dependencies: {...packageJson.dependencies},
    devDependencies: {...packageJson.devDependencies},
    peerDependencies: {...packageJson.peerDependencies},
  };

  // Save original state for restoration
  fs.writeFileSync(
    path.join(__dirname, 'packages/lib/.package.json.bak'),
    JSON.stringify(originalDeps, null, 2),
  );

  // Replace workspace: dependencies with actual versions
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (!packageJson[depType]) return;

    Object.keys(packageJson[depType]).forEach(dep => {
      const version = packageJson[depType][dep];
      if (version.startsWith('workspace:')) {
        // Replace with a valid version for npm
        packageJson[depType][dep] = '*';
      }
    });
  });

  // Write the modified package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Package.json prepared for semantic-release');
}

// Function to restore workspace dependencies after semantic-release
function restoreAfterRelease() {
  console.log('Restoring workspace dependencies...');

  const backupPath = path.join(__dirname, 'packages/lib/.package.json.bak');
  if (fs.existsSync(backupPath)) {
    const originalDeps = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Restore original dependencies
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (originalDeps[depType]) {
        packageJson[depType] = originalDeps[depType];
      }
    });

    // Write the restored package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    fs.unlinkSync(backupPath);
    console.log('Workspace dependencies restored');
  }
}

// Main function
async function main() {
  try {
    prepareForRelease();
    console.log('Running semantic-release...');
    execSync('npx semantic-release', {stdio: 'inherit'});
  } catch (error) {
    console.error('Error during release:', error);
    process.exitCode = 1;
  } finally {
    restoreAfterRelease();
  }
}

// Run the main function
main();
