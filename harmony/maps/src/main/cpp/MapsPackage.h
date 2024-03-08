#include "ComponentDescriptors.h"
#include "RNOH/Package.h"
#include "MapsJSIBinder.h"
#include "MapsNapiBinder.h"
#include "MapsEventEmitRequestHandler.h"
#include "AIRMapManagerTurboModule.h"

using namespace rnoh;
using namespace facebook;

class MapsTurboModuleFactoryDelegate : public TurboModuleFactoryDelegate {
public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
        if (name == "AIRMapManager") {
            return std::make_shared<AIRMapManagerTurboModule>(ctx, name);
        } else if (name == "AIRMapMarkerManager") {
            return std::make_shared<AIRMapManagerTurboModule>(ctx, name);
        }
        return nullptr;
    };
};


namespace rnoh {

    class MapsPackage : public Package {
    public:
        MapsPackage(Package::Context ctx) : Package(ctx) {}

        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override {
            return std::make_unique<MapsTurboModuleFactoryDelegate>();
        }

        std::vector<facebook::react::ComponentDescriptorProvider> createComponentDescriptorProviders() override {
            return {facebook::react::concreteComponentDescriptorProvider<facebook::react::AIRMapComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapMarkerComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapPolylineComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapPolygonComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapCircleComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapCalloutComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapCalloutSubviewComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::GeojsonComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapUrlTileComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapWMSTileComponentDescriptor>(),
                    facebook::react::concreteComponentDescriptorProvider<
                        facebook::react::AIRMapOverlayComponentDescriptor>()};
        };
    
        ComponentNapiBinderByString createComponentNapiBinderByName() override {
            return {{"AIRMap", std::make_shared<AIRMapNapiBinder>()},
                    {"AIRMapMarker", std::make_shared<AIRMapMarkerNapiBinder>()},
                    {"AIRMapPolyline", std::make_shared<AIRMapPolylineNapiBinder>()},
                    {"AIRMapPolygon", std::make_shared<AIRMapPolygonNapiBinder>()},
                    {"AIRMapCircle", std::make_shared<AIRMapCircleNapiBinder>()},
                    {"AIRMapCallout", std::make_shared<AIRMapCalloutNapiBinder>()},
                    {"AIRMapCalloutSubview", std::make_shared<AIRMapCalloutSubviewNapiBinder>()},
                    {"Geojson", std::make_shared<GeojsonNapiBinder>()},
                    {"AIRMapUrlTile", std::make_shared<AIRMapUrlTileNapiBinder>()},
                    {"AIRMapWMSTile", std::make_shared<AIRMapWMSTileNapiBinder>()},
                    {"AIRMapOverlay", std::make_shared<AIRMapOverlayNapiBinder>()}};
        };
    
        ComponentJSIBinderByString createComponentJSIBinderByName() override {
            return {{"AIRMap", std::make_shared<AIRMapJSIBinder>()},
                    {"AIRMapMarker", std::make_shared<AIRMapMarkerJSIBinder>()},
                    {"AIRMapPolyline", std::make_shared<AIRMapPolylineJSIBinder>()},
                    {"AIRMapPolygon", std::make_shared<AIRMapPolygonJSIBinder>()},
                    {"AIRMapCircle", std::make_shared<AIRMapCircleJSIBinder>()},
                    {"AIRMapCallout", std::make_shared<AIRMapCalloutJSIBinder>()},
                    {"AIRMapCalloutSubview", std::make_shared<AIRMapCalloutSubviewJSIBinder>()},
                    {"Geojson", std::make_shared<GeojsonJSIBinder>()},
                    {"AIRMapUrlTile", std::make_shared<AIRMapUrlTileJSIBinder>()},
                    {"AIRMapWMSTile", std::make_shared<AIRMapWMSTileJSIBinder>()},
                    {"AIRMapOverlay", std::make_shared<AIRMapOverlayJSIBinder>()}};
        };

        EventEmitRequestHandlers createEventEmitRequestHandlers() override {
            return {std::make_shared<AIRMapEventEmitRequestHandler>(),
                    std::make_shared<AIRMapMarkerEventEmitRequestHandler>(),
                    std::make_shared<AIRMapCalloutEventEmitRequestHandler>(),
                    std::make_shared<AIRMapCalloutSubviewEventEmitRequestHandler>()};
        };
    };
} // namespace rnoh