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

  // Create a minimal .npmrc that only contains what's needed
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
 * Recursively searches for and replaces workspace references in an object or string
 * Handles any pattern matching "workspace:" including those within JSON strings
 * @param {any} item - The item to check (object, array, string, etc)
 * @returns {any} - The modified item with workspace references replaced
 */
function removeWorkspaceRefs(item) {
  // Base case for non-objects and non-strings
  if (item === null || typeof item === 'undefined') {
    return item;
  }

  // Handle string case - this catches both regular properties and stringified JSON
  if (typeof item === 'string') {
    // Replace any occurrence of workspace: protocol
    if (item.includes('workspace:')) {
      const newValue = item
        .replace(/workspace:\*/g, '*')
        .replace(/workspace:\^/g, '^')
        .replace(/workspace:~/g, '~')
        .replace(/workspace:/g, '');
      console.log(
        `Found and replaced workspace reference: "${item}" → "${newValue}"`,
      );
      return newValue;
    }
    return item;
  }

  // Handle arrays
  if (Array.isArray(item)) {
    return item.map(el => removeWorkspaceRefs(el));
  }

  // Handle objects
  if (typeof item === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(item)) {
      result[key] = removeWorkspaceRefs(value);
    }
    return result;
  }

  // Default case for other types (numbers, booleans, etc.)
  return item;
}

/**
 * More thorough function to prepare package.json for release
 * including stringified JSON contents that might contain workspace references
 */
function prepareForRelease() {
  console.log('Preparing package.json for semantic-release...');

  // Read and backup the original package.json
  const packageJsonPath = libPackageJsonPath;
  let packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const backupPath = path.join(libDir, '.package.json.bak');
  fs.writeFileSync(backupPath, packageJsonContent);

  // First look for direct string patterns in the raw JSON content
  if (packageJsonContent.includes('workspace:')) {
    console.log('Found raw workspace: references in package.json content');
    packageJsonContent = packageJsonContent.replace(
      /["']workspace:[^"']*["']/g,
      '"*"',
    );
    fs.writeFileSync(packageJsonPath, packageJsonContent);
  }

  // Now parse and process the object
  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Process the entire package.json for workspace references
  packageJson = removeWorkspaceRefs(packageJson);

  // Remove workspace-related fields that might cause conflicts
  if (packageJson.workspaces) {
    console.log('Removing workspaces field from package.json');
    delete packageJson.workspaces;
  }

  // Write the modified package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Package.json prepared for semantic-release');

  // Also check for package-lock.json and temporarily rename it
  const packageLockPath = path.join(libDir, 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    const backupLockPath = path.join(libDir, '.package-lock.json.bak');
    fs.renameSync(packageLockPath, backupLockPath);
    console.log(`Temporarily moved package-lock.json to ${backupLockPath}`);
  }

  // Check for yarn.lock and temporarily rename it
  const yarnLockPath = path.join(libDir, 'yarn.lock');
  if (fs.existsSync(yarnLockPath)) {
    const backupYarnLockPath = path.join(libDir, '.yarn.lock.bak');
    fs.renameSync(yarnLockPath, backupYarnLockPath);
    console.log(`Temporarily moved yarn.lock to ${backupYarnLockPath}`);
  }

  return {
    packageJsonBackup: backupPath,
    packageLockBackup: fs.existsSync(
      path.join(libDir, '.package-lock.json.bak'),
    )
      ? path.join(libDir, '.package-lock.json.bak')
      : null,
    yarnLockBackup: fs.existsSync(path.join(libDir, '.yarn.lock.bak'))
      ? path.join(libDir, '.yarn.lock.bak')
      : null,
  };
}

/**
 * Restores all backed up files
 */
function restoreFiles(backups) {
  console.log('Restoring original files...');

  // Restore package.json
  if (backups.packageJsonBackup && fs.existsSync(backups.packageJsonBackup)) {
    const originalContent = fs.readFileSync(backups.packageJsonBackup, 'utf8');
    fs.writeFileSync(libPackageJsonPath, originalContent);
    fs.unlinkSync(backups.packageJsonBackup);
    console.log('Original package.json restored');
  } else {
    console.warn('No package.json backup found, could not restore');
  }

  // Restore package-lock.json if it existed
  if (backups.packageLockBackup && fs.existsSync(backups.packageLockBackup)) {
    fs.renameSync(
      backups.packageLockBackup,
      path.join(libDir, 'package-lock.json'),
    );
    console.log('Original package-lock.json restored');
  }

  // Restore yarn.lock if it existed
  if (backups.yarnLockBackup && fs.existsSync(backups.yarnLockBackup)) {
    fs.renameSync(backups.yarnLockBackup, path.join(libDir, 'yarn.lock'));
    console.log('Original yarn.lock restored');
  }
}

/**
 * Execute a command with proper error handling
 */
function safeExec(command, options) {
  try {
    return execSync(command, options);
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.stdout ? error.stdout.toString() : 'No stdout');
    console.error(error.stderr ? error.stderr.toString() : 'No stderr');
    throw error;
  }
}

async function main() {
  let backups = null;
  let npmrcPath = null;

  try {
    // Setup steps
    backups = prepareForRelease();
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

    // Create a clean environment with only the variables we need
    // This avoids conflicts with workspace-related flags
    const cleanEnv = {
      // System environment variables needed for proper operation
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      NPM_TOKEN: process.env.NPM_TOKEN,
      // Point to our custom npmrc
      NPM_CONFIG_USERCONFIG: npmrcPath,
      // Provenance setting
      NPM_CONFIG_PROVENANCE: process.env.NPM_CONFIG_PROVENANCE || 'true',
      // Disable workspace behavior explicitly
      NPM_CONFIG_WORKSPACES: 'false',
      // GitHub Actions environment variables
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
      GITHUB_SHA: process.env.GITHUB_SHA,
      GITHUB_REF: process.env.GITHUB_REF,
      GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME,
      GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW,
      GITHUB_ACTION: process.env.GITHUB_ACTION,
      GITHUB_ACTOR: process.env.GITHUB_ACTOR,
      GITHUB_HEAD_REF: process.env.GITHUB_HEAD_REF,
      GITHUB_BASE_REF: process.env.GITHUB_BASE_REF,
      RUNNER_OS: process.env.RUNNER_OS,
      CI: process.env.CI,
    };

    // Ensure no workspace flags are set in the environment
    // Explicitly unset any workspace-related npm configs
    const npmEnvVars = Object.keys(process.env).filter(
      key =>
        key.startsWith('npm_') ||
        key.startsWith('NPM_') ||
        key.includes('workspace') ||
        key.includes('WORKSPACE'),
    );

    console.log(
      'Filtering out potentially conflicting npm environment variables:',
    );
    npmEnvVars.forEach(key => {
      if (
        ![
          'NPM_TOKEN',
          'NPM_CONFIG_USERCONFIG',
          'NPM_CONFIG_PROVENANCE',
          'NPM_CONFIG_WORKSPACES',
        ].includes(key)
      ) {
        console.log(`- Excluding: ${key}`);
      } else {
        console.log(`- Keeping: ${key}`);
        // Keep these specific variables
        cleanEnv[key] = process.env[key];
      }
    });

    // Test the NPM_TOKEN with npm whoami
    console.log('Testing NPM token with npm whoami...');
    try {
      const npmWhich = execSync('which npm', {encoding: 'utf8'}).trim();
      console.log(`Using npm at: ${npmWhich}`);

      const npmVersion = execSync('npm --version', {encoding: 'utf8'}).trim();
      console.log(`npm version: ${npmVersion}`);

      const result = execSync('npm whoami --userconfig=' + npmrcPath, {
        encoding: 'utf8',
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          NPM_CONFIG_USERCONFIG: npmrcPath,
        },
      }).trim();
      console.log(`Successfully authenticated as npm user: ${result}`);
    } catch (error) {
      console.error('NPM authentication test failed:');
      console.error(error.stdout ? error.stdout.toString() : '');
      console.error(error.stderr ? error.stderr.toString() : '');
      console.warn(
        'Continuing despite npm whoami failure - the token might still work for semantic-release',
      );
    }

    // First build the project - this ensures all dependencies are resolved properly
    console.log('Building project before release...');
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: libDir,
      env: cleanEnv,
    });

    // Run semantic-release with carefully controlled environment
    console.log('Executing semantic-release...');
    execSync(semanticReleaseBin, {
      stdio: 'inherit',
      cwd: libDir, // Run from lib directory
      env: cleanEnv,
    });

    console.log('Semantic release completed successfully');
  } catch (error) {
    console.error('Error during release process:', error);
    process.exitCode = 1;
  } finally {
    // Cleanup steps - always run these
    if (backups) {
      restoreFiles(backups);
    }

    if (npmrcPath) {
      cleanupTempNpmrc();
    }

    console.log('Release script finished');
  }
}

main();
