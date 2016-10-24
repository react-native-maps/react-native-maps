#!/bin/bash
rm -rf example/testbuild/android
mkdir -p example/testbuild/android/build
mkdir -p example/testbuild/android

cd example/android && ./gradlew :app:assembleDebug --no-daemon
cd - &>/dev/null

cp example/android/app/build/outputs/apk/app-debug.apk example/testbuild/android.apk

echo 'Android Test App put in: example/testbuild/android.apk'
