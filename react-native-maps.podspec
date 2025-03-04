require 'json'

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
	s.name         = "react-native-maps"
	s.version      = package['version']
	s.summary      = package["description"]
	s.authors      = package["author"]
	s.homepage     = package["homepage"]
	s.license      = package["license"]
	s.platform     = :ios, "13.0"

	s.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }

	s.subspec 'react-native-apple-maps' do |sp|
		sp.name         = "react-native-apple-maps"
		sp.platform     = :ios, "13.0"

		sp.source_files = "ios/AirMaps/**/*.{h,m,mm,swift}"
		sp.resource_bundles = {
			'ReactNativeMapsPrivacy' => ['ios/PrivacyInfo.xcprivacy']
		}
	end

	Pod::UI.puts "#{s.name}: react-native-google-maps pod enabled"
	s.subspec 'react-native-google-maps' do |sp|
		sp.name         = "react-native-google-maps"
		sp.platform     = :ios, "15.0"

		sp.source_files = "ios/AirGoogleMaps/**/*.{h,m,mm,swift}"
		sp.resource_bundles = {
			'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
		}
		sp.compiler_flags = '-DHAVE_GOOGLE_MAPS=1'
		sp.dependency 'GoogleMaps', '9.3.0'
		sp.dependency 'Google-Maps-iOS-Utils', '6.1.0'
	end

	# Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
	# See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
	if respond_to?(:install_modules_dependencies, true)
		install_modules_dependencies(s)
	else
		s.dependency "React-Core"

		# Don't install the dependencies when we run `pod install` in the old architecture.
		if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
			s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
			s.pod_target_xcconfig    = {
				"HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
				"OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
				"CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
			}
			s.dependency "React-Codegen"
			s.dependency "RCT-Folly"
			s.dependency "RCTRequired"
			s.dependency "RCTTypeSafety"
			s.dependency "ReactCommon/turbomodule/core"
		end
	end
end
