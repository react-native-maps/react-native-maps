require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
	s.name         = "RNMaps"
	s.version      = package['version']
	s.summary      = package["description"]
	s.authors      = package["author"]
	s.homepage     = package["homepage"]
	s.license      = package["license"]
	s.platform     = :ios, "11.0"

	s.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }
	s.source_files  = "ios/AirMaps/**/*.{h,m}"

	s.dependency 'React-Core'

	if defined?($RNMapsWithGoogleMapsSupport) && ($RNMapsWithGoogleMapsSupport == true)
		Pod::UI.puts "#{s.name}: GoogleMaps support enabled"
		s.subspec 'RNGoogleMaps' do |sp|
			sp.name         = "RNMapsGoogleMapSupport"
			sp.platform     = :ios, "13.0"

			sp.source_files  = "ios/AirGoogleMaps/**/*.{h,m}"
			sp.compiler_flags = '-DHAVE_GOOGLE_MAPS=1', '-DHAVE_GOOGLE_MAPS_UTILS=1', '-fno-modules'

			sp.dependency 'React-Core'
			sp.dependency 'GoogleMaps', '7.0.0'
			sp.dependency 'Google-Maps-iOS-Utils', '4.1.0'
		end
	end
end
