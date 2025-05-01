// release.js
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Paths
const rootDir = __dirname;
const libDir = path.join(rootDir, 'packages/lib');
const libPackageJsonPath = path.join(libDir, 'package.json');
const tempNpmrcPath = path.join(
  process.env.HOME || process.env.USERPROFILE || '/tmp',
  '.npmrc.semantic-release',
);

/**
 * Creates a custom .npmrc file for semantic-release to use
 * This helps ensure npm commands work correctly in Yarn workspaces
 */
function createTempNpmrc() {
  // Verify and log NPM_TOKEN availability (masked for security)
  if (!process.env.NPM_TOKEN) {
    console.error('ERROR: NPM_TOKEN environment variable is not set!');
    throw new Error('NPM_TOKEN is required for publishing');
  } else {
    console.log('NPM_TOKEN is available (value is masked for security)');
  }

  const npmrcContent = `registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}
provenance=${process.env.NPM_CONFIG_PROVENANCE || 'true'}
`;
  fs.writeFileSync(tempNpmrcPath, npmrcContent);
  console.log(`Created temporary .npmrc at ${tempNpmrcPath}`);
  return tempNpmrcPath;
}

/**
 * Cleans up the temporary .npmrc file
 */
function cleanupTempNpmrc() {
  if (fs.existsSync(tempNpmrcPath)) {
    fs.unlinkSync(tempNpmrcPath);
    console.log(`Removed temporary .npmrc from ${tempNpmrcPath}`);
  }
}

/**
 * Prepares the package.json for semantic-release by replacing workspace references
 */
function prepareForRelease() {
  console.log('Preparing package.json for semantic-release...');

  // Read and backup the original package.json
  const packageJson = JSON.parse(fs.readFileSync(libPackageJsonPath, 'utf8'));
  const backupPath = path.join(libDir, '.package.json.bak');
  fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));

  // Get all dependency types to check
  const dependencyTypes = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];

  // Process each dependency type
  let hasWorkspaceDeps = false;
  dependencyTypes.forEach(depType => {
    if (!packageJson[depType]) return;

    Object.keys(packageJson[depType]).forEach(dep => {
      const version = packageJson[depType][dep];
      if (typeof version === 'string' && version.startsWith('workspace:')) {
        hasWorkspaceDeps = true;
        // Replace workspace: with a concrete version or *
        packageJson[depType][dep] = '*';
        console.log(
          `Replaced workspace dependency: ${dep}@${version} → ${dep}@*`,
        );
      }
    });
  });

  // Check for workspace references in resolutions
  if (packageJson.resolutions) {
    Object.keys(packageJson.resolutions).forEach(dep => {
      const version = packageJson.resolutions[dep];
      if (typeof version === 'string' && version.startsWith('workspace:')) {
        hasWorkspaceDeps = true;
        packageJson.resolutions[dep] = '*';
        console.log(
          `Replaced workspace resolution: ${dep}@${version} → ${dep}@*`,
        );
      }
    });
  }

  // Write the modified package.json
  fs.writeFileSync(libPackageJsonPath, JSON.stringify(packageJson, null, 2));

  if (hasWorkspaceDeps) {
    console.log(
      'Package.json prepared for semantic-release with workspace dependencies replaced',
    );
  } else {
    console.log('No workspace dependencies found in package.json');
  }

  return backupPath;
}

/**
 * Restores the original package.json
 */
function restorePackageJson(backupPath) {
  console.log('Restoring original package.json...');

  if (fs.existsSync(backupPath)) {
    // Restore the original package.json
    const originalContent = fs.readFileSync(backupPath, 'utf8');
    fs.writeFileSync(libPackageJsonPath, originalContent);
    fs.unlinkSync(backupPath);
    console.log('Original package.json restored');
  } else {
    console.warn('No backup file found, could not restore package.json');
  }
}

async function main() {
  let backupPath = null;
  let npmrcPath = null;

  try {
    // Setup steps
    backupPath = prepareForRelease();
    npmrcPath = createTempNpmrc();

    console.log('Running semantic-release from lib directory...');
    console.log('Environment variables available to script:');
    console.log(
      '- GITHUB_TOKEN:',
      process.env.GITHUB_TOKEN ? 'Set (masked)' : 'Not set',
    );
    console.log(
      '- NPM_TOKEN:',
      process.env.NPM_TOKEN ? 'Set (masked)' : 'Not set',
    );
    console.log('- NPM_CONFIG_PROVENANCE:', process.env.NPM_CONFIG_PROVENANCE);

    // Path to semantic-release binary
    const semanticReleaseBin = path.join(
      libDir,
      'node_modules',
      '.bin',
      'semantic-release',
    );

    console.log(
      `Checking if semantic-release exists at: ${semanticReleaseBin}`,
    );
    if (fs.existsSync(semanticReleaseBin)) {
      console.log('semantic-release binary found');
    } else {
      console.error('semantic-release binary NOT found!');
      throw new Error('semantic-release binary not found');
    }

    // Prepare environment for semantic-release
    const envVars = {
      ...process.env,
      // Explicitly pass through critical environment variables
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      NPM_TOKEN: process.env.NPM_TOKEN,
      // Use our temporary npmrc file
      NPM_CONFIG_USERCONFIG: npmrcPath,
      // Disable workspace features
      NPM_CONFIG_WORKSPACES: 'false',
      NPM_CONFIG_WORKSPACE: 'false',
      // Prevent npm from trying to use Yarn's workspace protocol
      NPM_CONFIG_ENGINE_STRICT: 'false',
      // Ensure npm knows this is not a workspace command
      npm_config_workspaces: 'false',
      npm_config_workspace: 'false',
    };

    // Run semantic-release with carefully controlled environment
    console.log('Executing semantic-release...');
    execSync(semanticReleaseBin, {
      stdio: 'inherit',
      cwd: libDir, // Run from lib directory
      env: envVars,
    });

    console.log('Semantic release completed successfully');
  } catch (error) {
    console.error('Error during release process:', error);
    process.exitCode = 1;
  } finally {
    // Cleanup steps - always run these
    if (backupPath) {
      restorePackageJson(backupPath);
    }

    if (npmrcPath) {
      cleanupTempNpmrc();
    }

    console.log('Release script finished');
  }
}

main();
