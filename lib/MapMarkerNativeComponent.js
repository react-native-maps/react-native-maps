"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const codegenNativeCommands_1 = __importDefault(require("react-native/Libraries/Utilities/codegenNativeCommands"));
exports.Commands = (0, codegenNativeCommands_1.default)({
    supportedCommands: [
        'showCallout',
        'hideCallout',
        'redrawCallout',
        'animateMarkerToCoordinate',
        'redraw',
    ],
});
