# Examples Setup

## iOS

1. If you don't have bundler gem installed:

```
gem install bundler
```

2. Install dependencies and open the workspace:

```
npm install
cd example/ios
bundle install
bundle exec pod install
cd ../../
rpm run run:ios
```

or

```
yarn install
cd example/ios
bundle install
bundle exec pod install
cd ../../
yarn run:ios
```

## android

1. Start your emulator

2. Install via gradle:

```
npm run run:android
```

or

```
yarn run:android
```
