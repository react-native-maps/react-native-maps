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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayAnimated = exports.MarkerAnimated = exports.enableLatestRenderer = exports.MAP_TYPES = exports.Animated = exports.Overlay = exports.Marker = exports.Geojson = exports.AnimatedRegion = exports.MapCalloutSubview = exports.CalloutSubview = exports.MapCallout = exports.Callout = exports.MapLocalTile = exports.LocalTile = exports.MapWMSTile = exports.WMSTile = exports.MapUrlTile = exports.UrlTile = exports.MapCircle = exports.Circle = exports.MapPolygon = exports.Polygon = exports.MapHeatmap = exports.Heatmap = exports.MapPolyline = exports.Polyline = exports.MapOverlay = exports.MapMarker = void 0;
const MapView_1 = __importStar(require("./MapView"));
Object.defineProperty(exports, "Animated", { enumerable: true, get: function () { return MapView_1.AnimatedMapView; } });
Object.defineProperty(exports, "MAP_TYPES", { enumerable: true, get: function () { return MapView_1.MAP_TYPES; } });
Object.defineProperty(exports, "enableLatestRenderer", { enumerable: true, get: function () { return MapView_1.enableLatestRenderer; } });
const MapMarker_1 = __importDefault(require("./MapMarker"));
exports.Marker = MapMarker_1.default;
var MapMarker_2 = require("./MapMarker");
Object.defineProperty(exports, "MapMarker", { enumerable: true, get: function () { return MapMarker_2.MapMarker; } });
const MapOverlay_1 = __importDefault(require("./MapOverlay"));
exports.Overlay = MapOverlay_1.default;
var MapOverlay_2 = require("./MapOverlay");
Object.defineProperty(exports, "MapOverlay", { enumerable: true, get: function () { return MapOverlay_2.MapOverlay; } });
var MapPolyline_1 = require("./MapPolyline");
Object.defineProperty(exports, "Polyline", { enumerable: true, get: function () { return __importDefault(MapPolyline_1).default; } });
Object.defineProperty(exports, "MapPolyline", { enumerable: true, get: function () { return MapPolyline_1.MapPolyline; } });
var MapHeatmap_1 = require("./MapHeatmap");
Object.defineProperty(exports, "Heatmap", { enumerable: true, get: function () { return __importDefault(MapHeatmap_1).default; } });
Object.defineProperty(exports, "MapHeatmap", { enumerable: true, get: function () { return MapHeatmap_1.MapHeatmap; } });
var MapPolygon_1 = require("./MapPolygon");
Object.defineProperty(exports, "Polygon", { enumerable: true, get: function () { return __importDefault(MapPolygon_1).default; } });
Object.defineProperty(exports, "MapPolygon", { enumerable: true, get: function () { return MapPolygon_1.MapPolygon; } });
var MapCircle_1 = require("./MapCircle");
Object.defineProperty(exports, "Circle", { enumerable: true, get: function () { return __importDefault(MapCircle_1).default; } });
Object.defineProperty(exports, "MapCircle", { enumerable: true, get: function () { return MapCircle_1.MapCircle; } });
var MapUrlTile_1 = require("./MapUrlTile");
Object.defineProperty(exports, "UrlTile", { enumerable: true, get: function () { return __importDefault(MapUrlTile_1).default; } });
Object.defineProperty(exports, "MapUrlTile", { enumerable: true, get: function () { return MapUrlTile_1.MapUrlTile; } });
var MapWMSTile_1 = require("./MapWMSTile");
Object.defineProperty(exports, "WMSTile", { enumerable: true, get: function () { return __importDefault(MapWMSTile_1).default; } });
Object.defineProperty(exports, "MapWMSTile", { enumerable: true, get: function () { return MapWMSTile_1.MapWMSTile; } });
var MapLocalTile_1 = require("./MapLocalTile");
Object.defineProperty(exports, "LocalTile", { enumerable: true, get: function () { return __importDefault(MapLocalTile_1).default; } });
Object.defineProperty(exports, "MapLocalTile", { enumerable: true, get: function () { return MapLocalTile_1.MapLocalTile; } });
var MapCallout_1 = require("./MapCallout");
Object.defineProperty(exports, "Callout", { enumerable: true, get: function () { return __importDefault(MapCallout_1).default; } });
Object.defineProperty(exports, "MapCallout", { enumerable: true, get: function () { return MapCallout_1.MapCallout; } });
var MapCalloutSubview_1 = require("./MapCalloutSubview");
Object.defineProperty(exports, "CalloutSubview", { enumerable: true, get: function () { return __importDefault(MapCalloutSubview_1).default; } });
Object.defineProperty(exports, "MapCalloutSubview", { enumerable: true, get: function () { return MapCalloutSubview_1.MapCalloutSubview; } });
var AnimatedRegion_1 = require("./AnimatedRegion");
Object.defineProperty(exports, "AnimatedRegion", { enumerable: true, get: function () { return __importDefault(AnimatedRegion_1).default; } });
var Geojson_1 = require("./Geojson");
Object.defineProperty(exports, "Geojson", { enumerable: true, get: function () { return __importDefault(Geojson_1).default; } });
__exportStar(require("./ProviderConstants"), exports);
__exportStar(require("./MapView.types"), exports);
__exportStar(require("./sharedTypes"), exports);
exports.MarkerAnimated = MapMarker_1.default.Animated;
exports.OverlayAnimated = MapOverlay_1.default.Animated;
exports.default = MapView_1.default;
