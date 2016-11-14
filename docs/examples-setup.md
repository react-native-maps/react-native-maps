# Examples Setup

## iOS

1. If you don't have bundler gem installed:

```
gem install bundler
```

2. Install dependencies and open the workspace:

```
cd example
npm install
cd ios
bundle install
bundle exec pod install
open AirMapsExplorer.xcworkspace
```

3. Make sure the `AirMapsExplorer` target is selected and click `Run`

## android

1. Start your emulator

2. Install via gradle:

```
# from the example/ dir:
react-native run-android
```
