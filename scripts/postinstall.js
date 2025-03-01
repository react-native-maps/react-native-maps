const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'rn-maps-config.json');
const packageJsonPath = path.join(process.cwd(), 'package.json');

let withGoogleMaps = false;

if (fs.existsSync(packageJsonPath) === true) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  withGoogleMaps = packageJson['react-native-maps']?.withGoogleMaps === true;
}

fs.writeFileSync(configPath, JSON.stringify({ withGoogleMaps }, null, 2));
