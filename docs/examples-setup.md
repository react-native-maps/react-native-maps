# Examples Setup

- Clone or download the repository.
- If you're on an Apple silicon Mac, uncomment the following line in `example/ios/Podfile`:

  `#pod 'Google-Maps-iOS-Utils', :git => 'https://github.com/Simon-TechForm/google-maps-ios-utils.git', :branch => 'feat/support-apple-silicon'`

- From the root of the project run `yarn bootstrap`
- `cd example`
- `yarn android` or `yarn ios`

**Please note that if you are trying out Android or using Google Maps on iOS, it's very likely that you will have to add your own API key for Google Maps to work. Check out the [Installation Instructions](./installation.md) to see how this is done, and make sure to run `yarn bootstrap` again after adding your personal API key.**
