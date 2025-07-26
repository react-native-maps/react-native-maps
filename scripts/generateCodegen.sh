#!/bin/bash
set -e

echo "Generating iOS codegen..."
node node_modules/react-native/scripts/generate-codegen-artifacts.js \
  --path . \
  --outputPath ios/generated \
  --targetPlatform ios

echo "Generating Android codegen..."
node node_modules/react-native/scripts/generate-codegen-artifacts.js \
  --path . \
  --outputPath android/src/main \
  --targetPlatform android

echo "Codegen completed."