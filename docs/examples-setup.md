# Examples Setup
Install dependencies for iOS and Android

    cd example
    npm install

## iOS
1. Install dependencies and open the workspace:

    ```
    cd ios
    pod install
    open AirMapsExplorer.xcworkspace
    ```
1. Make sure the `AirMapsExplorer` target is selected and click `Run`

## Android
1. Start your emulator
1. Install via Gradle:

    ```
    react-native run-android
    ./example/android/gradlew installDebug
    ```
