#!/bin/bash

if [ -z "$TRAVIS_BUILD_DIR" ]; then
  echo 'Not on Travis: not running travis_before_install_appium script'
else
  echo 'Running travis_before_install_appium script'
  brew update
  brew reinstall xctool
  brew reinstall watchman
  gem install xcpretty
  gem install cocoapods --version=1.1.1
  cd example
  npm install
  cd ios
  pod install
  cd $TRAVIS_BUILD_DIR
fi
