#include "RNOHCorePackage/ComponentBinders/ViewComponentJSIBinder.h"

namespace rnoh {

    class AIRMapJSIBinder : public ViewComponentJSIBinder {
        //属性
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "provider", "string");
            object.setProperty(rt, "region", "Region");
            object.setProperty(rt, "initialRegion", "Region");
            object.setProperty(rt, "camera", "Camera");
            object.setProperty(rt, "initialCamera", "Camera");
            object.setProperty(rt, "paddingAdjustmentBehavior", "PaddingAdjustmentBehavior");
            object.setProperty(rt, "liteMode", "bool");
            object.setProperty(rt, "mapType", "string");
            object.setProperty(rt, "customMapStyle", "array");
            object.setProperty(rt, "userInterfaceStyle", "string");
            object.setProperty(rt, "showsUserLocation", "bool");
            object.setProperty(rt, "userLocationPriority", "UserLocationPriority");
            object.setProperty(rt, "userLocationUpdateInterval", "int");
            object.setProperty(rt, "userLocationFastestInterval", "int");
            object.setProperty(rt, "userLocationAnnotationTitle", "string");
            object.setProperty(rt, "followsUserLocation", "bool");
            object.setProperty(rt, "userLocationCalloutEnabled", "bool");
            object.setProperty(rt, "showsMyLocationButton", "bool");
            object.setProperty(rt, "showsPointsOfInterest", "bool");
            object.setProperty(rt, "showsCompass", "bool");
            object.setProperty(rt, "showsScale", "bool");
            object.setProperty(rt, "showsBuildings", "bool");
            object.setProperty(rt, "showsTraffic", "bool");
            object.setProperty(rt, "showsIndoors", "bool");
            object.setProperty(rt, "showsIndoorLevelPicker", "bool");
            object.setProperty(rt, "zoomEnabled", "bool");
            object.setProperty(rt, "zoomTapEnabled", "bool");
            object.setProperty(rt, "zoomControlEnabled", "bool");
            object.setProperty(rt, "minZoomLevel", "bool");
            object.setProperty(rt, "maxZoomLevel", "bool");
            object.setProperty(rt, "rotateEnabled", "bool");
            object.setProperty(rt, "scrollEnabled", "bool");
            object.setProperty(rt, "scrollDuringRotateOrZoomEnabled", "bool");
            object.setProperty(rt, "pitchEnabled", "bool");
            object.setProperty(rt, "toolbarEnabled", "bool");
            object.setProperty(rt, "cacheEnabled", "bool");
            object.setProperty(rt, "loadingEnabled", "bool");
            object.setProperty(rt, "loadingIndicatorColor", "Color");
            object.setProperty(rt, "loadingBackgroundColor", "Color");
            object.setProperty(rt, "tintColor", "Color");
            object.setProperty(rt, "moveOnMarkerPress", "bool");
            object.setProperty(rt, "legalLabelInsets", "EdgeInsets");
            object.setProperty(rt, "kmlSrc", "string");
            object.setProperty(rt, "compassOffset", "Point");
            object.setProperty(rt, "isAccessibilityElement", "bool");
            object.setProperty(rt, "googleMapId", "string");
            object.setProperty(rt, "customMapStyleString", "string");
            return object;
        }
    
        //事件
        facebook::jsi::Object createDirectEventTypes(facebook::jsi::Runtime &rt) override {
            facebook::jsi::Object events(rt);
            events.setProperty(rt, "topMapReady", createDirectEvent(rt, "onMapReady"));
            events.setProperty(rt, "topPress", createDirectEvent(rt, "onPress"));
            events.setProperty(rt, "topLongPress", createDirectEvent(rt, "onLongPress"));
            events.setProperty(rt, "topRegionChange", createDirectEvent(rt, "onRegionChange"));
            events.setProperty(rt, "topMarkerPress", createDirectEvent(rt, "onMarkerPress"));
            events.setProperty(rt, "topMarkerDrag", createDirectEvent(rt, "onMarkerDrag"));
            events.setProperty(rt, "topMarkerDragStart", createDirectEvent(rt, "onMarkerDragStart"));
            events.setProperty(rt, "topMarkerDragEnd", createDirectEvent(rt, "onMarkerDragEnd"));
            events.setProperty(rt, "topPoiClick", createDirectEvent(rt, "onPoiClick"));
            return events;
        }
    };

    class AIRMapMarkerJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "title", "string");
            object.setProperty(rt, "description", "string");
            object.setProperty(rt, "coordinate", "Region");
            object.setProperty(rt, "rotation", "float");
            object.setProperty(rt, "draggable", "bool");
            object.setProperty(rt, "flat", "bool");
            object.setProperty(rt, "image", "string");
            object.setProperty(rt, "calloutAnchor", "Point");
            object.setProperty(rt, "anchor", "Point");
            object.setProperty(rt, "tappable", "bool");
            object.setProperty(rt, "opacity", "float");
            return object;
        }

        facebook::jsi::Object createDirectEventTypes(facebook::jsi::Runtime &rt) override {
            facebook::jsi::Object events(rt);
            events.setProperty(rt, "topPress", createDirectEvent(rt, "onPress"));
            events.setProperty(rt, "topDragStart", createDirectEvent(rt, "onDragStart"));
            events.setProperty(rt, "topDrag", createDirectEvent(rt, "onDrag"));
            events.setProperty(rt, "topDragEnd", createDirectEvent(rt, "onDragEnd"));
            return events;
        }
    };

    class AIRMapPolylineJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "coordinates", "array");
            object.setProperty(rt, "strokeColor", "string");
            object.setProperty(rt, "strokeColors", "array");
            object.setProperty(rt, "strokeWidth", "int");
            object.setProperty(rt, "lineDashPattern", "array");
            object.setProperty(rt, "geodesic", "bool");
            object.setProperty(rt, "tappable", "bool");
            object.setProperty(rt, "lineJoin", "string");
            object.setProperty(rt, "lineCap", "string");
            return object;
        }
    };

    class AIRMapPolygonJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "coordinates", "array");
            object.setProperty(rt, "fillColor", "string");
            object.setProperty(rt, "strokeColor", "string");
            object.setProperty(rt, "strokeWidth", "int");
            object.setProperty(rt, "geodesic", "bool");
            object.setProperty(rt, "lineDashPattern", "array");
            object.setProperty(rt, "holes", "array");
            object.setProperty(rt, "zIndex", "int");
            object.setProperty(rt, "tappable", "bool");
            object.setProperty(rt, "lineJoin", "string");
            object.setProperty(rt, "lineCap", "string");
            return object;
        }
    };

    class AIRMapCircleJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "center", "LatLng");
            object.setProperty(rt, "radius", "int");
            object.setProperty(rt, "fillColor", "string");
            object.setProperty(rt, "strokeColor", "string");
            object.setProperty(rt, "zIndex", "int");
            object.setProperty(rt, "strokeWidth", "int");
            object.setProperty(rt, "lineDashPattern", "array");
            return object;
        }
    };

    class AIRMapCalloutJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "tooltip", "bool");
            object.setProperty(rt, "alphaHitTest", "bool");
            return object;
        }

        facebook::jsi::Object createDirectEventTypes(facebook::jsi::Runtime &rt) override {
            facebook::jsi::Object events(rt);
            events.setProperty(rt, "topPress", createDirectEvent(rt, "onPress"));
            return events;
        }
    };

    class AIRMapCalloutSubviewJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            return object;
        }

        facebook::jsi::Object createDirectEventTypes(facebook::jsi::Runtime &rt) override {
            facebook::jsi::Object events(rt);
            events.setProperty(rt, "topPress", createDirectEvent(rt, "onPress"));
            return events;
        }
    };

    class GeojsonJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "geojson", "GeoJSON");
            object.setProperty(rt, "strokeColor", "string");
            object.setProperty(rt, "fillColor", "string");
            object.setProperty(rt, "strokeWidth", "int");
            object.setProperty(rt, "color", "string");
            object.setProperty(rt, "lineDashPhase", "int");
            object.setProperty(rt, "lineDashPattern", "arry");
            object.setProperty(rt, "lineCap", "string");
            object.setProperty(rt, "lineJoin", "string");
            object.setProperty(rt, "miterLimit", "int");
            object.setProperty(rt, "zIndex", "int");
            object.setProperty(rt, "markerComponent", "Object");
            object.setProperty(rt, "title", "string");
            object.setProperty(rt, "tracksViewChanges", "bool");
            return object;
        }
    };

    class AIRMapUrlTileJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "urlTemplate", "string");
            object.setProperty(rt, "minimumZ", "int");
            object.setProperty(rt, "maximumZ", "int");
            object.setProperty(rt, "maximumNativeZ", "int");
            object.setProperty(rt, "zIndex", "int");
            object.setProperty(rt, "tileSize", "int");
            object.setProperty(rt, "doubleTileSize", "bool");
            object.setProperty(rt, "shouldReplaceMapContent", "bool");
            object.setProperty(rt, "flipY", "bool");
            object.setProperty(rt, "tileCachePath", "string");
            object.setProperty(rt, "tileCacheMaxAge", "int");
            object.setProperty(rt, "offlineMode", "bool");
            object.setProperty(rt, "opacity", "int");
            return object;
        }
    };

    class AIRMapWMSTileJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "urlTemplate", "string");
            object.setProperty(rt, "minimumZ", "int");
            object.setProperty(rt, "maximumZ", "int");
            object.setProperty(rt, "maximumNativeZ", "int");
            object.setProperty(rt, "zIndex", "int");
            object.setProperty(rt, "tileSize", "int");
            object.setProperty(rt, "doubleTileSize", "bool");
            object.setProperty(rt, "shouldReplaceMapContent", "bool");
            object.setProperty(rt, "flipY", "bool");
            object.setProperty(rt, "tileCachePath", "string");
            object.setProperty(rt, "tileCacheMaxAge", "int");
            object.setProperty(rt, "offlineMode", "bool");
            object.setProperty(rt, "opacity", "int");
            return object;
        }
    };

    class AIRMapOverlayJSIBinder : public ViewComponentJSIBinder {
        facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override {
            auto object = ViewComponentJSIBinder::createNativeProps(rt);
            object.setProperty(rt, "image", "string");
            object.setProperty(rt, "bounds", "array");
            object.setProperty(rt, "bearing", "int");
            object.setProperty(rt, "tappable", "bool");
            object.setProperty(rt, "opacity", "int");
            return object;
        }
    };

} // namespace rnoh