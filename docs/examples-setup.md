# Examples Setup

- Clone or download the repository.
- From the root of the project run `yarn bootstrap`
- Add your API key(s)
  - Android
    - Open `example/android/local.properties` (or create the file if it doesn't already exist)
    - Add the following line: `MAPS_API_KEY=your_api_key_here`
  - iOS
    - Open `example/ios/Config.xcconfig` (or create the file if it doesn't already exist)
    - Add the following line: `MAPS_API_KEY=your_api_key_here`
- Run `yarn android` or `yarn ios` within the example folder
