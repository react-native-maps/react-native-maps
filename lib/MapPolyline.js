"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPolyline = void 0;
const React = __importStar(require("react"));
const decorateMapComponent_1 = __importStar(require("./decorateMapComponent"));
class MapPolyline extends React.Component {
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    polyline;
    constructor(props) {
        super(props);
        this.polyline = React.createRef();
    }
    setNativeProps(props) {
        this.polyline.current?.setNativeProps(props);
    }
    render() {
        const { strokeColor = '#000', strokeWidth = 1, lineJoin = 'round', lineCap = 'round', } = this.props;
        const AIRMapPolyline = this.getNativeComponent();
        return (<AIRMapPolyline {...this.props} strokeColor={strokeColor} strokeWidth={strokeWidth} lineJoin={lineJoin} lineCap={lineCap} ref={this.polyline}/>);
    }
}
exports.MapPolyline = MapPolyline;
exports.default = (0, decorateMapComponent_1.default)(MapPolyline, 'Polyline', {
    google: {
        ios: decorateMapComponent_1.SUPPORTED,
        android: decorateMapComponent_1.USES_DEFAULT_IMPLEMENTATION,
    },
});
