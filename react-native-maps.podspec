Pod::Spec.new do |s|
  s.name         = "react-native-maps"
  s.version      = "0.13.0"
  s.summary      = "React Native Mapview component for iOS + Android"

  s.authors      = { "intelligibabble" => "leland.m.richardson@gmail.com" }
  s.homepage     = "https://github.com/airbnb/react-native-maps#readme"
  s.license      = "MIT"
  s.platform     = :ios, "8.0"

  s.source       = { :git => "https://github.com/airbnb/react-native-maps.git" }
  s.source_files  = "ios/AirMaps/**/*.{h,m}"

  s.dependency 'React'
end
