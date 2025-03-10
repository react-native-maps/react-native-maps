const fs = require('fs');
const path = require('path');

const packageJsonPath = './package.json';
const srcSpecsDir = './src/specs';
const destSpecsDir = './specs';

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory "${src}" does not exist.`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, {recursive: true});
  }

  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Copy src/specs to specs
copyDirectory(srcSpecsDir, destSpecsDir);
console.log(`Copied "${srcSpecsDir}" to "${destSpecsDir}"`);

// Read and update package.json
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (packageJson.codegenConfig) {
    packageJson.codegenConfig.jsSrcsDir = './specs';
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
  console.log("Updated codegenConfig.jsSrcsDir to './specs'");
} else {
  console.error('package.json not found.');
}
