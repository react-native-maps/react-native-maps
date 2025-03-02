require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

folly_config = get_folly_config()
folly_compiler_flags = folly_config[:compiler_flags]

Pod::Spec.new do |s|
  s.name = "react-native-maps"
  s.version = package['version']
  s.summary = package["description"]
  s.authors = package["author"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.platform = :ios, "13.0"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }

  # Define the default base subspec
  s.default_subspec = 'base'

  # Base subspec for standard maps
  s.subspec 'base' do |sp|
    sp.source_files = "ios/AirMaps/**/*.{h,m,mm,swift}"
    sp.dependency "React-Core"
    sp.dependency "react-native-maps/generated"
    sp.compiler_flags = folly_compiler_flags
    install_modules_dependencies(sp)
  end

  # Separate subspec for Google Maps support
  s.subspec 'google-maps' do |sp|
    sp.platform = :ios, "15.0"
    sp.source_files = "ios/AirGoogleMaps/**/*.{h,m,mm,swift}"
    sp.resource_bundles = {
      'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
    }
    sp.compiler_flags = folly_compiler_flags + ' -DHAVE_GOOGLE_MAPS=1 -DHAVE_GOOGLE_MAPS_UTILS=1'
    sp.dependency "react-native-maps/generated"
    sp.dependency 'GoogleMaps', '9.3.0'
    sp.dependency 'Google-Maps-iOS-Utils', '6.1.0'
    install_modules_dependencies(sp)
  end

  # Generated podspec as a subspec
  s.subspec 'generated' do |sp|
    sp.source_files = 'ios/generated/**/*.{h,m,mm,cpp}'
    sp.exclude_files = [
      'ios/generated/**/RCTAppDependencyProvider.{h,mm}',
      'ios/generated/**/RCTThirdPartyComponentsProvider.{h,mm}',
      'ios/generated/**/RCTModulesConformingToProtocolsProvider.{h,mm}'
    ]


    sp.public_header_files = [
        'ios/generated/react-native-maps-generated-umbrella.h',
        'ios/generated/RNMapsSpecs/ComponentDescriptors.h',
        'ios/generated/RNMapsSpecs/EventEmitters.h',
        'ios/generated/RNMapsSpecs/Props.h',
        'ios/generated/RNMapsSpecs/RCTComponentViewHelpers.h',
        'ios/generated/RNMapsSpecs/RNMapsSpecs.h'
    ]
    sp.header_mappings_dir = 'ios/generated'
    sp.resource_bundles = {
      'ReactNativeMapsPrivacy' => ['ios/PrivacyInfo.xcprivacy']
    }
    install_modules_dependencies(sp)
  end
end
