require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

folly_config = get_folly_config()
folly_compiler_flags = folly_config[:compiler_flags]

Pod::Spec.new do |s|
  s.name = "react-native-maps-generated"
  s.version = package['version']
  s.summary = package["description"]
  s.authors = package["author"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.platform = :ios, "15.1"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }
  s.source_files = "ios/generated/**/*.{h,m,mm,cpp,swift}"
  s.exclude_files = [
    "ios/generated/RCTAppDependencyProvider.h",
    "ios/generated/RCTAppDependencyProvider.mm",
    "ios/generated/RCTThirdPartyComponentsProvider.h",
    "ios/generated/RCTThirdPartyComponentsProvider.mm",
    "ios/generated/RCTModulesConformingToProtocolsProvider.h",
    "ios/generated/RCTModulesConformingToProtocolsProvider.mm",
  ]
  s.module_map = 'ios/generated/module.modulemap'
  s.public_header_files = "ios/generated/**/*.h"
  s.module_name = 'ReactNativeMapsGenerated'
  s.compiler_flags = folly_compiler_flags
  install_modules_dependencies(s)

end
