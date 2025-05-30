import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
export const Commands = codegenNativeCommands({
    supportedCommands: [
        'animateToRegion',
        'setCamera',
        'animateCamera',
        'fitToElements',
        'fitToSuppliedMarkers',
        'fitToCoordinates',
        'setIndoorActiveLevelIndex',
    ],
});
export default codegenNativeComponent('RNMapsGoogleMapView', {
    excludedPlatforms: ['android'],
});
