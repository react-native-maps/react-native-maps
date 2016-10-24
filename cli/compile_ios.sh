#!/bin/bash
rm -rf example/testbuild/ios
mkdir -p example/testbuild/ios/build
mkdir -p example/testbuild/ios

xcodebuild GCC_PREPROCESSOR_DEFINITIONS='$GCC_PREPROCESSOR_DEFINITIONS TEST_ENVIRONMENT=1' \
           -workspace "`pwd`/example/ios/AirMapsExplorer.xcworkspace" \
           -scheme "AirMapsExplorer" -sdk iphonesimulator -configuration 'Debug' \
           -destination 'platform=iOS Simulator,name=iPhone 6s,OS=latest' \
           OBJROOT="`pwd`/example/testbuild/ios/build" \
           SYMROOT="`pwd`/example/testbuild/ios/build" ONLY_ACTIVE_ARCH=NO | xcpretty -c
zip -r example/testbuild/ios.zip example/testbuild/ios/build/Debug-iphonesimulator/AirMapsExplorer.app

echo 'iOS Test App put in: example/testbuild/ios.zip'
