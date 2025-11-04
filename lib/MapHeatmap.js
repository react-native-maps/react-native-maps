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
exports.MapHeatmap = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const decorateMapComponent_1 = __importStar(require("./decorateMapComponent"));
class MapHeatmap extends React.Component {
    getNativeComponent;
    getMapManagerCommand;
    getUIManagerCommand;
    heatmap;
    constructor(props) {
        super(props);
        this.heatmap = React.createRef();
    }
    setNativeProps(props) {
        this.heatmap.current?.setNativeProps(props);
    }
    render() {
        const AIRMapHeatmap = this.getNativeComponent();
        const propGradient = this.props.gradient;
        let gradient;
        if (propGradient) {
            const colors = propGradient.colors.map(c => (0, react_native_1.processColor)(c));
            gradient = { ...propGradient, colors };
        }
        return (<AIRMapHeatmap {...this.props} gradient={gradient} ref={this.heatmap}/>);
    }
}
exports.MapHeatmap = MapHeatmap;
exports.default = (0, decorateMapComponent_1.default)(MapHeatmap, 'Heatmap', {
    google: {
        ios: decorateMapComponent_1.SUPPORTED,
        android: decorateMapComponent_1.USES_DEFAULT_IMPLEMENTATION,
    },
});
