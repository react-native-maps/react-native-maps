require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = "react-native-maps-generated"
  s.version = package['version']
  s.summary = "Generated Fabric glue for react-native-maps"
  s.authors = package["author"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.platform = :ios, "13.0"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }

  s.module_map = "ios/generated/module.modulemap"

  s.source_files = 'ios/generated/**/*.{h,m,mm,cpp}'
  s.source_files = 'ios/generated/**/*.{h,m,mm,cpp}'
  s.exclude_files = [
    'ios/generated/**/RCTAppDependencyProvider.{h,mm}',
    'ios/generated/**/RCTThirdPartyComponentsProvider.{h,mm}',
    'ios/generated/**/RCTModulesConformingToProtocolsProvider.{h,mm}'
  ]
  s.public_header_files = "ios/generated/react-native-maps-generated-umbrella.h"


  # Privacy resources
  s.resource_bundles = {
    'ReactNativeMapsPrivacy' => ['ios/PrivacyInfo.xcprivacy']
  }

  install_modules_dependencies(s)
end
