require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-maps-generated"
  s.version      = package['version']
  s.summary      = package["description"]
  s.authors      = package["author"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.platform     = :ios, "12.0"

  s.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }
  s.source_files = 'ios/generated/**/*.{h,m,mm,cpp}'
  s.public_header_files = "ios/generated/**/*.h"
  s.resource_bundles = {
      'ReactNativeMapsPrivacy' => ['ios/PrivacyInfo.xcprivacy']
  }
  s.dependency 'React-Core'

  install_modules_dependencies(s)
end
