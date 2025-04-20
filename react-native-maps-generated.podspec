# react-native-maps-generated-simple.podspec
Pod::Spec.new do |s|
  s.name = "react-native-maps-generated"
  s.version = "1.22.2"
  s.summary = "React Native Mapview component for iOS + Android"
  s.authors = { "Salah Ghanim" => "salah.ghanim@gmail.com" }
  s.homepage = "https://github.com/react-native-maps/react-native-maps"
  s.license = "MIT"
  s.platform = :ios, "15.1"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag => "v1.22.2" }
  s.source_files = "ios/generated/**/*.{h,m,mm,swift}"
  s.module_map = 'ios/generated/module.modulemap'
  s.public_header_files = "ios/generated/**/*.h"
  s.module_name = 'ReactNativeMapsGenerated'
  s.dependency 'React-Core'
end
