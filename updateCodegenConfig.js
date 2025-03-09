const fs = require('fs');

const packageJsonPath = './package.json';

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Modify the jsSrcsDir field
if (packageJson.codegenConfig) {
  packageJson.codegenConfig.jsSrcsDir = './lib/specs';
}

// Write back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log("Updated codegenConfig.jsSrcsDir to './lib/specs'");
