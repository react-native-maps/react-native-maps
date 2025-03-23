const fs = require('fs');

const packageJsonPath = './package.json';

// Read and update package.json
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (packageJson.codegenConfig) {
    packageJson.codegenConfig.jsSrcsDir = './lib/specs';
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
  console.log(
    "Updated package.json's codegenConfig.jsSrcsDir to './lib/specs'",
  );
} else {
  console.error('package.json not found.');
}
