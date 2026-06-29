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
  s.platform = :ios, "15.1"
  s.source = { :git => "https://github.com/react-native-maps/react-native-maps.git", :tag => "v#{s.version}" }

  # Set module_name at the root spec level
  s.module_name = 'ReactNativeMaps'

  # Generated code subspec
  s.subspec 'Generated' do |ss|
    ss.source_files = "ios/generated/**/*.{h,m,mm,cpp,swift}"
    ss.exclude_files = [
      "ios/generated/RCTModuleProviders.h",
      "ios/generated/RCTModuleProviders.mm",
      "ios/generated/RCTUnstableModulesRequiringMainQueueSetupProvider.h",
      "ios/generated/RCTUnstableModulesRequiringMainQueueSetupProvider.mm",
      "ios/generated/RCTAppDependencyProvider.h",
      "ios/generated/RCTAppDependencyProvider.mm",
      "ios/generated/RCTThirdPartyComponentsProvider.h",
      "ios/generated/RCTThirdPartyComponentsProvider.mm",
      "ios/generated/RCTModulesConformingToProtocolsProvider.h",
      "ios/generated/RCTModulesConformingToProtocolsProvider.mm",
    ]
    ss.public_header_files = "ios/generated/**/*.h"
    ss.compiler_flags = folly_compiler_flags
    install_modules_dependencies(ss)
  end

  # Main maps component
  s.subspec 'Maps' do |ss|
    ss.source_files = "ios/AirMaps/**/*.{h,m,mm,swift}"
    ss.public_header_files = [
      'ios/AirMaps/UIView+AirMap.h',
      'ios/AirMaps/RCTConvert+AirMap.h',
    ]
    ss.compiler_flags = folly_compiler_flags
    ss.dependency 'react-native-maps/Generated'
    install_modules_dependencies(ss)
     # Add script phase to detect Google Maps
    ss.script_phases = [
       {
         :name => 'react-native-maps patches',
         :script => %(
           set -x
           echo "Running Google Maps detection script..."
           DEFINES_DIR="${PODS_TARGET_SRCROOT}/ios/AirMaps"
           DEFINES_FILE="${DEFINES_DIR}/RNMapsDefines.h"

           mkdir -p "$DEFINES_DIR"

           if [ -d "$PODS_ROOT/GoogleMaps" ] && [ -d "$PODS_ROOT/Google-Maps-iOS-Utils" ]; then
             echo "#define HAVE_GOOGLE_MAPS 1" > "$DEFINES_FILE"
             echo "✅ Google Maps libraries detected. HAVE_GOOGLE_MAPS defined."
           else
             echo "#define HAVE_GOOGLE_MAPS 0" > "$DEFINES_FILE"
             echo "❌ Google Maps libraries NOT detected. HAVE_GOOGLE_MAPS set to 0."
           fi

           if [ -f "$DEFINES_FILE" ]; then
             echo "✅ Successfully wrote to $DEFINES_FILE"
             cat "$DEFINES_FILE"
           else
             echo "❌ ERROR: Failed to write to $DEFINES_FILE"
           fi

             set -e
                 echo "🔧 Patching @import GoogleMaps..."

                 FILES=(
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMSMarker+GMUClusteritem.h"
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMUGeoJSONParser.h"
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMUPolygon.h"
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMUWeightedLatLng.h"
                   "$PODS_ROOT/GoogleMaps/Maps/Sources/GMSEmpty.h"
                 )

                 for file in "${FILES[@]}"; do
                   if [ -f "$file" ]; then
                     if grep -q "@import GoogleMaps;" "$file"; then
                       sed -i '' 's/@import GoogleMaps;/#import <GoogleMaps\\/GoogleMaps.h>/' "$file"
                       echo "✅ Patched: $file"
                     else
                       echo "ℹ️ No @import in: $file"
                     fi
                   else
                     echo "⚠️ Not found: $file"
                   fi
                 done
         ),
         :execution_position => :before_compile
        }
      ]
  end

  # Google Maps subspec
  s.subspec 'Google' do |ss|
    ss.source_files = "ios/AirGoogleMaps/**/*.{h,m,mm,swift}"
    ss.resource_bundles = {
      'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
    }
    # Fixed compiler flags to avoid -Wno warnings
    ss.compiler_flags = folly_compiler_flags + ' -DHAVE_GOOGLE_MAPS=1 -DHAVE_GOOGLE_MAPS_UTILS=1'
    
    google_maps_version = '9.4.0'
    google_maps_utils_version = '6.1.0'

    if defined?($RNMapsGoogleMapsVersion)
      Pod::UI.puts "#{s.name}: Using user specified GoogleMaps version '#{$RNMapsGoogleMapsVersion}'"
      google_maps_version = $RNMapsGoogleMapsVersion
    end

    if defined?($RNMapsGoogleMapsUtilsVersion)
      Pod::UI.puts "#{s.name}: Using user specified Google-Maps-iOS-Utils version '#{$RNMapsGoogleMapsUtilsVersion}'"
      google_maps_utils_version = $RNMapsGoogleMapsUtilsVersion
    end

    ss.dependency 'GoogleMaps', google_maps_version #'8.4.0'
    ss.dependency 'Google-Maps-iOS-Utils', google_maps_utils_version #'5.0.0'
    ss.dependency 'react-native-maps/Generated'
    ss.dependency 'react-native-maps/Maps'
    install_modules_dependencies(ss)
  end

  # By default, use the Maps subspec
  s.default_subspec = 'Maps'

end
