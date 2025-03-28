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

  s.source_files = "ios/AirMaps/**/*.{h,m,mm,swift}"
  s.dependency "React-Core"
  s.compiler_flags = folly_compiler_flags
  s.dependency 'react-native-maps-generated'
  install_modules_dependencies(s)

     # Add script phase to detect Google Maps
  s.script_phases = [
      {
          :name => 'Check react-native-google-maps Availability',
          :script => %(
            GOOGLE_MAPS_HEADER_PATH="$PODS_ROOT/Headers/Public/react-native-google-maps/AIRGoogleMap.h"
            DEFINES_FILE="$CONFIGURATION_BUILD_DIR/react-native-maps/RNMapsDefines.h"

            # Ensure the defines file directory exists
            mkdir -p "$(dirname "$DEFINES_FILE")"

            # Check if Google Maps header exists
            if [ -f "$GOOGLE_MAPS_HEADER_PATH" ]; then
              echo "#define HAVE_GOOGLE_MAPS 1" > "$DEFINES_FILE"
              echo "Google Maps detected. HAVE_GOOGLE_MAPS defined."
            else
              echo "#define HAVE_GOOGLE_MAPS 0" > "$DEFINES_FILE"
              echo "Google Maps not detected."
            fi
          ),
          :execution_position => :before_compile
      }
  ]

  # Add the generated defines header to the header search path
  s.pod_target_xcconfig = {
    'HEADER_SEARCH_PATHS' => "\"$(CONFIGURATION_BUILD_DIR)/react-native-google-maps\" \"${PODS_ROOT}/Headers/Private/Yoga\""
  }
end
