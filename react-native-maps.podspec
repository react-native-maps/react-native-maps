require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

folly_config = get_folly_config()
folly_compiler_flags = folly_config[:compiler_flags]

Pod::UI.puts "\e[32m[react-native-maps] Thank you for using react-native-maps ❤️! \n[react-native-maps] to help keep it maintained, please consider sponsoring at https://github.com/sponsors/salah-ghanim\e[0m"

Pod::Spec.new do |s|
  s.name = "react-native-maps"
  s.version = package['version']
  s.summary = package["description"]
  s.authors = package["author"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.platform = :ios, "15.1"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag=> "v#{s.version}" }

  s.source_files = "ios/AirMaps/**/*.{h,m,mm,swift}"
  s.module_map = 'ios/AirMaps/module.modulemap'
  s.public_header_files = [
    'ios/AirMaps/UIView+AirMap.h',
    'ios/AirMaps/RCTConvert+AirMap.h',
  ]
  s.module_name = 'ReactNativeMaps'
  s.compiler_flags = folly_compiler_flags
  s.dependency 'react-native-maps-generated'
  install_modules_dependencies(s)

     # Add script phase to detect Google Maps
  s.script_phases = [
      {
          :name => 'Check react-native-google-Maps Availability',
          :script => %(
            set -x
            echo "Running Google Maps detection script..."
            DEFINES_DIR="${PODS_TARGET_SRCROOT}/ios/AirMaps"
            DEFINES_FILE="${DEFINES_DIR}/RNMapsDefines.h"

            # Standard path
            GOOGLE_MAPS_STANDARD_PATH="$PODS_ROOT/Headers/Public/react-native-google-maps/AIRGoogleMap.h"

            # Framework paths
            GOOGLE_MAPS_FRAMEWORK_MODULE="$PODS_ROOT/Target Support Files/react-native-google-maps/react-native-google-maps.modulemap"
            GOOGLE_MAPS_UMBRELLA_HEADER="$PODS_ROOT/Target Support Files/react-native-google-maps/react-native-google-maps-umbrella.h"

            echo "Checking standard path: $GOOGLE_MAPS_STANDARD_PATH"
            echo "Checking framework module path: $GOOGLE_MAPS_FRAMEWORK_MODULE"
            echo "Checking umbrella header path: $GOOGLE_MAPS_UMBRELLA_HEADER"

            # Check if Google Maps is available via any detection method
            if [ -f "$GOOGLE_MAPS_STANDARD_PATH" ] || [ -f "$GOOGLE_MAPS_FRAMEWORK_MODULE" ] || [ -f "$GOOGLE_MAPS_UMBRELLA_HEADER" ]; then
              echo "#define HAVE_GOOGLE_MAPS 1" > "$DEFINES_FILE"
              echo "Google Maps detected. HAVE_GOOGLE_MAPS defined."
            else
              echo "#define HAVE_GOOGLE_MAPS 0" > "$DEFINES_FILE"
              echo "Google Maps not detected."
            fi

            # Verify the file was written
            if [ -f "$DEFINES_FILE" ]; then
              echo "Successfully wrote to $DEFINES_FILE"
              cat "$DEFINES_FILE"
            else
              echo "ERROR: Failed to write to $DEFINES_FILE"
            fi
          ),
          :execution_position => :before_compile
      }
  ]


end
