Pod::Spec.new do |s|
  s.name         = "react-native-maps-generated"
  s.version      = "1.22.5"
  s.summary      = "Generated Fabric code for react-native-maps"
  s.description  = <<-DESC
                   This pod contains the Fabric Native Component code generated for react-native-maps.
                   DESC
  s.license      = { :type => 'MIT' }
  s.homepage     = "https://github.com/react-native-maps/react-native-maps"
  s.authors      = { "react-native-maps" => "https://github.com/react-native-maps" }
  s.platform     = :ios, "15.1"
  s.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag => "v1.22.5" }

  s.resource_bundles = {
   'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
  }
end
