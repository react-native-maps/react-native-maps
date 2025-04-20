Pod::Spec.new do |spec|
  spec.name         = "react-native-maps-generated"
  spec.version      = "1.22.5"
  spec.summary      = "fabric codegen react-native-maps-generated."
  spec.description  = <<-DESC
                        Generated Fabric code for react-native-maps
                   DESC
  spec.homepage     = "https://github.com/react-native-maps/react-native-maps"
  spec.license = { :type => 'MIT', :file => 'LICENSE' }
  spec.author             = { "salah ghanim" => "salah.ghanim@gmail.com" }
  spec.platform     = :ios, "15.1"
  spec.source       = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag => "#{spec.version}" }
  spec.resource_bundles = {
   'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
  }

end
