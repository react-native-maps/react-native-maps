require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-google-maps"
  s.version      = package['version']
  s.summary      = "React Native Mapview component for iOS + Android"

  s.authors      = { "intelligibabble" => "leland.m.richardson@gmail.com" }
  s.homepage     = "https://github.com/react-native-maps/react-native-maps#readme"
  s.license      = "MIT"
  s.platform     = :ios, "8.0"

  s.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }
  s.source_files  = "lib/ios/AirGoogleMaps/**/*.{h,m}"
  s.compiler_flags = '-DHAVE_GOOGLE_MAPS=1', '-DHAVE_GOOGLE_MAPS_UTILS=1', '-fno-modules'

  s.dependency 'React-Core'
  s.dependency 'GoogleMaps', '5.1.0'
  s.dependency 'Google-Maps-iOS-Utils', '3.10.3'
end
