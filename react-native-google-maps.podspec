require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

folly_config = get_folly_config()
folly_compiler_flags = folly_config[:compiler_flags]

Pod::Spec.new do |s|
  s.name = "react-native-google-maps"
  s.version = package['version']
  s.summary = package["description"]
  s.authors = package["author"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.platform = :ios, "15.1"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }
  s.source_files = "ios/AirGoogleMaps/**/*.{h,m,mm,swift}"
  s.resource_bundles = {
   'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
  }
  s.compiler_flags = folly_compiler_flags + ' -DHAVE_GOOGLE_MAPS=1 -DHAVE_GOOGLE_MAPS_UTILS=1'
  s.dependency 'GoogleMaps', '9.3.0'
  s.dependency 'Google-Maps-iOS-Utils', '6.1.0'
  s.dependency 'react-native-maps-generated'
  s.dependency 'react-native-maps'
  install_modules_dependencies(s)

end
