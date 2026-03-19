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
             GOOGLE_MAPS_VALUE=1
             echo "✅ Google Maps libraries detected via CocoaPods. HAVE_GOOGLE_MAPS defined as 1."
           elif [ -d "${BUILD_DIR}/../../SourcePackages/artifacts/ios-maps-sdk" ]; then
             GOOGLE_MAPS_VALUE=1
             echo "✅ Google Maps detected via Swift Package Manager. HAVE_GOOGLE_MAPS defined as 1."
           else
             GOOGLE_MAPS_VALUE=0
             echo "❌ Google Maps libraries NOT detected (CocoaPods or SPM). HAVE_GOOGLE_MAPS set to 0."
           fi

           printf "#ifndef HAVE_GOOGLE_MAPS\n#define HAVE_GOOGLE_MAPS %d\n#endif\n" "$GOOGLE_MAPS_VALUE" > "$DEFINES_FILE"

           if [ -f "$DEFINES_FILE" ]; then
             echo "✅ Successfully wrote to $DEFINES_FILE"
             cat "$DEFINES_FILE"
           else
             echo "❌ ERROR: Failed to write to $DEFINES_FILE"
           fi

             set -e
                 echo "🔧 Patching @import GoogleMaps..."

                 # CocoaPods paths
                 SPM_UTILS_INCLUDE="${BUILD_DIR}/../../SourcePackages/checkouts/google-maps-ios-utils/Sources/GoogleMapsUtilsObjC/include"
                 FILES=(
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMSMarker+GMUClusteritem.h"
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMUGeoJSONParser.h"
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMUPolygon.h"
                   "$PODS_ROOT/Google-Maps-iOS-Utils/Sources/GoogleMapsUtilsObjC/include/GMUWeightedLatLng.h"
                   "$PODS_ROOT/GoogleMaps/Maps/Sources/GMSEmpty.h"
                   # SPM checkout paths
                   "$SPM_UTILS_INCLUDE/GMSMarker+GMUClusteritem.h"
                   "$SPM_UTILS_INCLUDE/GMUGeoJSONParser.h"
                   "$SPM_UTILS_INCLUDE/GMUPolygon.h"
                   "$SPM_UTILS_INCLUDE/GMUWeightedLatLng.h"
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
    ss.dependency 'GoogleMaps', '9.4.0'
    ss.dependency 'Google-Maps-iOS-Utils', '6.1.0'
    ss.dependency 'react-native-maps/Generated'
    ss.dependency 'react-native-maps/Maps'
    install_modules_dependencies(ss)
  end

  # Google Maps subspec using Swift Package Manager
  # GoogleMaps and Google-Maps-iOS-Utils must be added to the Xcode project manually via SPM:
  #   - https://github.com/googlemaps/ios-maps-sdk
  #   - https://github.com/googlemaps/google-maps-ios-utils
  s.subspec 'GoogleSPM' do |ss|
    ss.source_files = "ios/AirGoogleMaps/**/*.{h,m,mm,swift}"
    ss.resource_bundles = {
      'GoogleMapsPrivacy' => ['ios/AirGoogleMaps/Resources/GoogleMapsPrivacy.bundle']
    }
    ss.compiler_flags = folly_compiler_flags + ' -DHAVE_GOOGLE_MAPS=1 -DHAVE_GOOGLE_MAPS_UTILS=1'
    # GoogleMaps is distributed as a binary XCFramework (static library + headers) via SPM.
    # $(FRAMEWORK_SEARCH_PATHS) / -F cannot resolve static XCFrameworks, so we point
    # HEADER_SEARCH_PATHS to the Headers directory inside each known slice.
    # Both slices contain identical headers; the linker picks the correct binary automatically.
    # $(BUILD_DIR) resolves to DerivedData/<project>/Build/Products at compile time,
    # so ../../SourcePackages always points to the SPM SourcePackages directory.
    ss.pod_target_xcconfig = {
      'HEADER_SEARCH_PATHS' => [
        '$(inherited)',
        # GoogleMaps binary XCFramework – headers are identical across slices; both included for device + simulator builds.
        '"$(BUILD_DIR)/../../SourcePackages/artifacts/ios-maps-sdk/GoogleMaps/GoogleMaps.xcframework/ios-arm64/Headers"',
        '"$(BUILD_DIR)/../../SourcePackages/artifacts/ios-maps-sdk/GoogleMaps/GoogleMaps.xcframework/ios-arm64_x86_64-simulator/Headers"',
        # google-maps-ios-utils is a source-based SPM package; public ObjC headers live in the checkout.
        '"$(BUILD_DIR)/../../SourcePackages/checkouts/google-maps-ios-utils/Sources/GoogleMapsUtilsObjC/include"',
      ].join(' ')
    }
    ss.dependency 'react-native-maps/Generated'
    ss.dependency 'react-native-maps/Maps'
    install_modules_dependencies(ss)
  end

  # By default, use the Maps subspec
  s.default_subspec = 'Maps'

end
