#include "RNOHCorePackage/ComponentBinders/ViewComponentNapiBinder.h"
#include "Props.h"

namespace rnoh {

    class AIRMapNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapProps>(shadowView.props)) {
//                 LOG(INFO) << "liwang AIRMapNapiBinder Region latitude: " << props->initialRegion;
//                 LOG(INFO) << "liwang AIRMapNapiBinder Region longitude: " << props->customMapStyle;
return ArkJS(env)
    .getObjectBuilder(napiViewProps)
    .addProperty("provider", props->provider)
    .addProperty("region", props->region)
    .addProperty("initialRegion", props->initialRegion)
    .addProperty("camera", props->camera)
    .addProperty("initialCamera", props->initialCamera)
    .addProperty("paddingAdjustmentBehavior", props->paddingAdjustmentBehavior)
    .addProperty("liteMode", props->liteMode)
    .addProperty("mapType", props->mapType)
    .addProperty("userInterfaceStyle", props->userInterfaceStyle)
    .addProperty("showsUserLocation", props->showsUserLocation)
    .addProperty("userLocationPriority", props->userLocationPriority)
    .addProperty("userLocationUpdateInterval", props->userLocationUpdateInterval)
    .addProperty("userLocationFastestInterval", props->userLocationFastestInterval)
    .addProperty("userLocationAnnotationTitle", props->userLocationAnnotationTitle)
    .addProperty("followsUserLocation", props->followsUserLocation)
    .addProperty("userLocationCalloutEnabled", props->userLocationCalloutEnabled)
    .addProperty("showsMyLocationButton", props->showsMyLocationButton)
    .addProperty("showsPointsOfInterest", props->showsPointsOfInterest)
    .addProperty("showsCompass", props->showsCompass)
    .addProperty("showsScale", props->showsScale)
    .addProperty("showsBuildings", props->showsBuildings)
    .addProperty("showsTraffic", props->showsTraffic)
    .addProperty("showsIndoors", props->showsIndoors)
    .addProperty("showsIndoorLevelPicker", props->showsIndoorLevelPicker)
    .addProperty("zoomEnabled", props->zoomEnabled)
    .addProperty("zoomTapEnabled", props->zoomTapEnabled)
    .addProperty("zoomControlEnabled", props->zoomControlEnabled)
    .addProperty("minZoomLevel", props->minZoomLevel)
    .addProperty("maxZoomLevel", props->maxZoomLevel)
    .addProperty("rotateEnabled", props->rotateEnabled)
    .addProperty("scrollEnabled", props->scrollEnabled)
    .addProperty("scrollDuringRotateOrZoomEnabled", props->scrollDuringRotateOrZoomEnabled)
    .addProperty("pitchEnabled", props->pitchEnabled)
    .addProperty("toolbarEnabled", props->toolbarEnabled)
    .addProperty("cacheEnabled", props->cacheEnabled)
    .addProperty("loadingEnabled", props->loadingEnabled)
    .addProperty("loadingIndicatorColor", props->loadingIndicatorColor)
    .addProperty("loadingIndicatorColor", props->loadingBackgroundColor)
    .addProperty("loadingIndicatorColor", props->tintColor)
    .addProperty("moveOnMarkerPress", props->moveOnMarkerPress)
    .addProperty("kmlSrc", props->kmlSrc)
    .addProperty("compassOffset", props->compassOffset)
    .addProperty("isAccessibilityElement", props->isAccessibilityElement)
    .addProperty("customMapStyle", props->customMapStyle)

    // AIRMap
    .addProperty("googleMapId", props->googleMapId)
    .addProperty("customMapStyleString", props->customMapStyleString)
    .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapMarkerNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapMarkerProps>(shadowView.props)) {
        return ArkJS(env)
            .getObjectBuilder(napiViewProps)
            .addProperty("title", props->title)
            .addProperty("description", props->description)
            .addProperty("coordinate", props->coordinate)
            .addProperty("rotation", props->rotation)
            .addProperty("draggable", props->draggable)
            .addProperty("flat", props->flat)
            .addProperty("image", props->image)
            .addProperty("calloutAnchor", props->calloutAnchor)
            .addProperty("anchor", props->anchor)
            .addProperty("tappable", props->tappable)
            .addProperty("opacity", props->opacity)
            .build();
                    }
                    return napiViewProps;
                };
    };

    class AIRMapPolylineNapiBinder : public ViewComponentNapiBinder {
        public:
            napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
                napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
                if (auto props =
                        std::dynamic_pointer_cast<const facebook::react::AIRMapPolylineProps>(shadowView.props)) {
            return ArkJS(env)
                .getObjectBuilder(napiViewProps)
                .addProperty("coordinates", props->coordinates)
                .addProperty("strokeColor", props->strokeColor)
                .addProperty("strokeColors", props->strokeColors)
                .addProperty("strokeWidth", props->strokeWidth)
                .addProperty("lineDashPattern", props->lineDashPattern)
                .addProperty("geodesic", props->geodesic)
                .addProperty("tappable", props->tappable)
                .addProperty("lineJoin", props->lineJoin)
                .addProperty("lineCap", props->lineCap)
                .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapPolygonNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapPolygonProps>(shadowView.props)) {
            return ArkJS(env)
                .getObjectBuilder(napiViewProps)
                .addProperty("coordinates", props->coordinates)
                .addProperty("fillColor", props->fillColor)
                .addProperty("strokeColor", props->strokeColor)
                .addProperty("strokeWidth", props->strokeWidth)
                .addProperty("geodesic", props->geodesic)
                .addProperty("lineDashPattern", props->lineDashPattern)
                .addProperty("holes", props->holes)
                .addProperty("zIndex", props->zIndexa)
                .addProperty("tappable", props->tappable)
                .addProperty("lineJoin", props->lineJoin)
                .addProperty("lineCap", props->lineCap)
                .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapCircleNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapCircleProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .addProperty("center", props->center)
                        .addProperty("radius", props->radius)
                        .addProperty("fillColor", props->fillColor)
                        .addProperty("strokeColor", props->strokeColor)
                        .addProperty("zIndex", props->zIndexa)
                        .addProperty("strokeWidth", props->strokeWidth)
                        .addProperty("lineDashPattern", props->lineDashPattern)
                        .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapCalloutNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapCalloutProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .addProperty("tooltip", props->tooltip)
                        .addProperty("alphaHitTest", props->alphaHitTest)
                        .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapCalloutSubviewNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapCalloutSubviewProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .build();
            }
            return napiViewProps;
        };
    };

    class GeojsonNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::GeojsonProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .addProperty("geojson", props->geojson)
                        .addProperty("strokeColor", props->strokeColor)
                        .addProperty("fillColor", props->fillColor)
                        .addProperty("strokeWidth", props->strokeWidth)
                        .addProperty("color", props->color)
                        .addProperty("lineDashPhase", props->lineDashPhase)
                        .addProperty("lineDashPattern", props->lineDashPattern)
                        .addProperty("lineCap", props->lineCap)
                        .addProperty("lineJoin", props->lineJoin)
                        .addProperty("miterLimit", props->miterLimit)
                        .addProperty("zIndex", props->zIndexa)
                        .addProperty("markerComponent", props->markerComponent)
                        .addProperty("title", props->title)
                        .addProperty("tracksViewChanges", props->tracksViewChanges)
                        .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapUrlTileNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapUrlTileProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .addProperty("urlTemplate", props->urlTemplate)
                        .addProperty("minimumZ", props->minimumZ)
                        .addProperty("maximumZ", props->maximumZ)
                        .addProperty("maximumNativeZ", props->maximumNativeZ)
                        .addProperty("zIndex", props->zIndexa)
                        .addProperty("tileSize", props->tileSize)
                        .addProperty("doubleTileSize", props->doubleTileSize)
                        .addProperty("shouldReplaceMapContent", props->shouldReplaceMapContent)
                        .addProperty("flipY", props->flipY)
                        .addProperty("tileCachePath", props->tileCachePath)
                        .addProperty("tileCacheMaxAge", props->tileCacheMaxAge)
                        .addProperty("offlineMode", props->offlineMode)
                        .addProperty("opacity", props->opacity)
                        .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapWMSTileNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapWMSTileProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .addProperty("urlTemplate", props->urlTemplate)
                        .addProperty("minimumZ", props->minimumZ)
                        .addProperty("maximumZ", props->maximumZ)
                        .addProperty("maximumNativeZ", props->maximumNativeZ)
                        .addProperty("zIndex", props->zIndexa)
                        .addProperty("tileSize", props->tileSize)
                        .addProperty("doubleTileSize", props->doubleTileSize)
                        .addProperty("shouldReplaceMapContent", props->shouldReplaceMapContent)
                        .addProperty("flipY", props->flipY)
                        .addProperty("tileCachePath", props->tileCachePath)
                        .addProperty("tileCacheMaxAge", props->tileCacheMaxAge)
                        .addProperty("offlineMode", props->offlineMode)
                        .addProperty("opacity", props->opacity)
                        .build();
            }
            return napiViewProps;
        };
    };

    class AIRMapOverlayNapiBinder : public ViewComponentNapiBinder {
    public:
        napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override {
            napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
            if (auto props = std::dynamic_pointer_cast<const facebook::react::AIRMapOverlayProps>(shadowView.props)) {
                    return ArkJS(env)
                        .getObjectBuilder(napiViewProps)
                        .addProperty("image", props->image)
                        .addProperty("bounds", props->bounds)
                        .addProperty("bearing", props->bearing)
                        .addProperty("tappable", props->tappable)
                        .addProperty("opacity", props->opacity)
                        .build();
            }
            return napiViewProps;
        };
    };

} //namespace rnoh