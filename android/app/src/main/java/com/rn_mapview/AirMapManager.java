package com.rn_mapview;

import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

import java.util.Map;

import javax.annotation.Nullable;


public class AirMapManager extends ViewGroupManager<AirMapView> {

    public static final String REACT_CLASS = "AIRMap";

    public static final int ANIMATE_TO_REGION = 1;
    public static final int ANIMATE_TO_COORDINATE = 2;
    public static final int FIT_TO_ELEMENTS = 3;

    private Map<String, Integer> MAP_TYPES = MapBuilder.of(
        "standard", GoogleMap.MAP_TYPE_NORMAL,
        "satellite", GoogleMap.MAP_TYPE_SATELLITE,
        "hybrid", GoogleMap.MAP_TYPE_HYBRID
    );

    private ReactContext reactContext;

    private AirMapMarkerManager markerManager;
    private AirMapPolylineManager polylineManager;
    private AirMapPolygonManager polygonManager;
    private AirMapCircleManager circleManager;

    public AirMapManager(
        AirMapMarkerManager markerManager,
        AirMapPolylineManager polylineManager,
        AirMapPolygonManager polygonManager,
        AirMapCircleManager circleManager
    ) {
        super();
        this.markerManager = markerManager;
        this.polylineManager = polylineManager;
        this.polygonManager = polygonManager;
        this.circleManager = circleManager;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected AirMapView createViewInstance(ThemedReactContext context) {
        reactContext = context;
        AirMapView view = new AirMapView(context);

        if (view.map == null) {
            emitMapError("Map is null", "map_null");
        } else {

            try {
                MapsInitializer.initialize(context.getApplicationContext());
            } catch (Exception e) {
                e.printStackTrace();
                emitMapError("Map initialize error", "map_init_error");
            }
        }

        return view;
    }

    private void emitMapError (String message, String type) {
        WritableMap error = Arguments.createMap();
        error.putString("message", message);
        error.putString("type", type);

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onError", error);
    }

    @ReactProp(name="region")
    public void setRegion(AirMapView view, ReadableMap region) {
        view.setRegion(region);
    }

    @ReactProp(name="initialRegion")
    public void setInitialRegion(AirMapView view, ReadableMap region) {
        view.setInitialRegion(region);
    }

    @ReactProp(name="mapType")
    public void setMapType(AirMapView view, @Nullable String mapType) {
        int typeId = MAP_TYPES.get(mapType);
        view.map.setMapType(typeId);
    }

    @ReactProp(name="showsUserLocation", defaultBoolean = false)
    public void setShowsUserLocation(AirMapView view, boolean showUserLocation) {
        view.setShowsUserLocation(showUserLocation);
    }

    @ReactProp(name="showsTraffic", defaultBoolean = false)
    public void setShowTraffic(AirMapView view, boolean showTraffic) {
        view.map.setTrafficEnabled(showTraffic);
    }

    @ReactProp(name="showsBuildings", defaultBoolean = false)
    public void setShowBuildings(AirMapView view, boolean showBuildings) {
        view.map.setBuildingsEnabled(showBuildings);
    }

    @ReactProp(name="showsIndoors", defaultBoolean = false)
    public void setShowIndoors(AirMapView view, boolean showIndoors) {
        view.map.setIndoorEnabled(showIndoors);
    }

    @ReactProp(name="showsCompass", defaultBoolean = false)
    public void setShowsCompass(AirMapView view, boolean showsCompass) {
        view.map.getUiSettings().setCompassEnabled(showsCompass);
    }

    @ReactProp(name="scrollEnabled", defaultBoolean = false)
    public void setScrollEnabled(AirMapView view, boolean scrollEnabled) {
        view.map.getUiSettings().setScrollGesturesEnabled(scrollEnabled);
    }

    @ReactProp(name="zoomEnabled", defaultBoolean = false)
    public void setZoomEnabled(AirMapView view, boolean zoomEnabled) {
        view.map.getUiSettings().setZoomGesturesEnabled(zoomEnabled);
    }

    @ReactProp(name="rotateEnabled", defaultBoolean = false)
    public void setRotateEnabled(AirMapView view, boolean rotateEnabled) {
        view.map.getUiSettings().setRotateGesturesEnabled(rotateEnabled);
    }

    @Override
    public void receiveCommand(AirMapView view, int commandId, @Nullable ReadableArray args) {
        Integer duration;
        Double lat;
        Double lng;
        Double lngDelta;
        Double latDelta;
        ReadableMap region;

        switch (commandId) {
            case ANIMATE_TO_REGION:
                region = args.getMap(0);
                duration = args.getInt(1);
                lng = region.getDouble("longitude");
                lat = region.getDouble("latitude");
                lngDelta = region.getDouble("longitudeDelta");
                latDelta = region.getDouble("latitudeDelta");
                LatLngBounds bounds = new LatLngBounds(
                        new LatLng(lat - latDelta / 2, lng - lngDelta / 2), // southwest
                        new LatLng(lat + latDelta / 2, lng + lngDelta / 2)  // northeast
                );
                view.animateToRegion(bounds, duration);
                break;

            case ANIMATE_TO_COORDINATE:
                region = args.getMap(0);
                duration = args.getInt(1);
                lng = region.getDouble("longitude");
                lat = region.getDouble("latitude");
                view.animateToCoordinate(new LatLng(lat, lng), duration);
                break;

            case FIT_TO_ELEMENTS:
                view.fitToElements(args.getBoolean(0));
                break;
        }
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "onPress", MapBuilder.of("registrationName", "onPress"),
            "onLongPress", MapBuilder.of("registrationName", "onLongPress"),
            "onMarkerPress", MapBuilder.of("registrationName", "onMarkerPress"),
            "onMarkerSelect", MapBuilder.of("registrationName", "onMarkerSelect"),
            "onMarkerDeselect", MapBuilder.of("registrationName", "onMarkerDeselect"),
            "onCalloutPress", MapBuilder.of("registrationName", "onCalloutPress")
        );
    }

    @Override
    public @Nullable Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
            "animateToRegion", ANIMATE_TO_REGION,
            "animateToCoordinate", ANIMATE_TO_COORDINATE,
            "fitToElements", FIT_TO_ELEMENTS
        );
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, AirMapView view) {
        view.addEventEmitters(this, reactContext);
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        // A custom shadow node is needed in order to pass back the width/height of the map to the
        // view manager so that it can start applying camera moves with bounds.
        return new SizeReportingShadowNode();
    }

    @Override
    public void addView(AirMapView parent, View child, int index) {
        parent.addFeature(child, index);
    }

    @Override
    public int getChildCount(AirMapView view) {
        return view.getFeatureCount();
    }

    @Override
    public View getChildAt(AirMapView view, int index) {
        return view.getFeatureAt(index);
    }

    @Override
    public void removeViewAt(AirMapView parent, int index) {
        parent.removeFeatureAt(index);
    }

    @Override
    public void updateExtraData(AirMapView view, Object extraData) {
        view.updateExtraData(extraData);
    }

    public void pushEvent(View view, String name, WritableMap data) {
        ReactContext reactContext = (ReactContext) view.getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
                .receiveEvent(view.getId(), name, data);
    }

}
