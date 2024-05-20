require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-google-maps"
  s.version      = package['version']
  s.summary      = package["description"]
  s.authors      = package["author"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.platform     = :ios, "13.4"

  s.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }
  s.source_files  = "ios/AirGoogleMaps/**/*.{h,m}"
  s.resource_bundles = {
      'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
  }
  s.compiler_flags = '-DHAVE_GOOGLE_MAPS=1', '-DHAVE_GOOGLE_MAPS_UTILS=1'
  s.pod_target_xcconfig = { 'FRAMEWORK_SEARCH_PATHS' => '"${PODS_CONFIGURATION_BUILD_DIR}/react-native-maps"' }

  s.dependency 'React-Core'
  s.dependency 'GoogleMaps', '7.4.0'
  s.dependency 'Google-Maps-iOS-Utils', '4.2.2'
end
