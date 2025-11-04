import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
export const Commands = codegenNativeCommands({
    supportedCommands: [
        'setCoordinates',
        'animateToCoordinates',
        'showCallout',
        'hideCallout',
        'redrawCallout',
        'redraw',
    ],
});
export default codegenNativeComponent('RNMapsMarker', {});
