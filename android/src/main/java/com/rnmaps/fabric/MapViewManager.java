package com.rnmaps.fabric;


import static com.rnmaps.maps.MapManager.MY_LOCATION_PRIORITY;

import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMapViewManagerInterface;
import com.facebook.react.viewmanagers.RNMapsMapViewManagerDelegate;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.model.CameraPosition;
import com.rnmaps.maps.MapView;
import com.rnmaps.maps.SizeReportingShadowNode;

import java.util.Map;

@ReactModule(name = MapViewManager.REACT_CLASS)
public class MapViewManager extends ViewGroupManager<MapView> implements RNMapsMapViewManagerInterface<MapView> {

    private static boolean rendererInitialized = false;
    private final RNMapsMapViewManagerDelegate<MapView, MapViewManager> delegate =
            new RNMapsMapViewManagerDelegate<>(this);


    public MapViewManager(ReactApplicationContext context) {
        super(context);
    }


    @Override
    public ViewManagerDelegate<MapView> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapView createViewInstance(ThemedReactContext context) {
        return new MapView(context, new GoogleMapOptions());
    }

    @Override
    protected void setupViewRecycling() {
        // override parent to block recycling / allow reliable GoogleMapsOptions passing
    }

    @Override
    protected MapView createViewInstance(int reactTag, @NonNull ThemedReactContext reactContext, @Nullable ReactStylesDiffMap initialProps, @Nullable StateWrapper stateWrapper) {
        MapView view = null;
        GoogleMapOptions options = new GoogleMapOptions();
        if (initialProps != null) {
            setGoogleRenderer(null, initialProps.getString("googleRenderer"));
            if (initialProps.hasKey("liteMode")) {
                options.liteMode(initialProps.getBoolean("liteMode", false));
            }
            if (initialProps.hasKey("googleMapId")) {
                String googleMapId = initialProps.getString("googleMapId");
                options.mapId(googleMapId);
            }
            if (initialProps.getMap("initialCamera") != null) {
                ReadableMap initialCamera = initialProps.getMap("initialCamera");
                CameraPosition camera = MapView.cameraPositionFromMap(initialCamera);
                if (camera != null) {
                    options.camera(camera);
                }
            }
            if (initialProps.hasKey("mapType")) {
                if (initialProps.getString("mapType") != null) {
                    options.mapType(mapTypeFromStrValue(initialProps.getString("mapType")));
                }
            }
            if (initialProps.hasKey("minZoom")) {
                if (initialProps.getInt("minZoom", 0) != 0) {
                    options.minZoomPreference(initialProps.getInt("minZoom", 0));
                }
            }
            if (initialProps.hasKey("maxZoom")) {
                if (initialProps.getInt("maxZoom", 0) != 0) {
                    options.maxZoomPreference(initialProps.getInt("maxZoom", 0));
                }
            }
            if (initialProps.hasKey("pitchEnabled")) {
                options.tiltGesturesEnabled(initialProps.getBoolean("pitchEnabled", true));
            }
            if (initialProps.hasKey("rotateEnabled")) {
                options.rotateGesturesEnabled(initialProps.getBoolean("rotateEnabled", true));
            }
            if (initialProps.hasKey("scrollDuringRotateOrZoomEnabled")) {
                options.scrollGesturesEnabledDuringRotateOrZoom(initialProps.getBoolean("scrollDuringRotateOrZoomEnabled", true));
            }
            if (initialProps.hasKey("scrollEnabled")) {
                options.scrollGesturesEnabled(initialProps.getBoolean("scrollEnabled", true));
            }
            if (initialProps.hasKey("showsCompass")) {
                options.compassEnabled(initialProps.getBoolean("showsCompass", true));
            }
            if (initialProps.hasKey("toolbarEnabled")) {
                options.mapToolbarEnabled(initialProps.getBoolean("toolbarEnabled", true));
            }
            if (initialProps.hasKey("zoomControlEnabled")) {
                options.zoomControlsEnabled(initialProps.getBoolean("zoomControlEnabled", true));
            }
            if (initialProps.hasKey("zoomEnabled")) {
                options.zoomGesturesEnabled(initialProps.getBoolean("zoomEnabled", true));
            }
        }

        view = new MapView(reactContext, options);
        view.setId(reactTag);
        this.addEventEmitters(reactContext, view);
        if (initialProps != null) {
            this.updateProperties(view, initialProps);
        }
        if (stateWrapper != null) {
            Object extraData = this.updateState(view, initialProps, stateWrapper);
            if (extraData != null) {
                this.updateExtraData(view, extraData);
            }
        }
        return view;
    }


    public static final String REACT_CLASS = "RNMapsMapView";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapView.getExportedCustomBubblingEventTypeConstants();
    }


    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        // A custom shadow node is needed in order to pass back the width/height of the map to the
        // view manager so that it can start applying camera moves with bounds.
        return new SizeReportingShadowNode();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapView.getExportedCustomDirectEventTypeConstants();
    }

    @Override
    public void setCacheEnabled(MapView view, boolean value) {
        view.setCacheEnabled(value);
    }

    @Override
    public void setCamera(MapView view, @Nullable ReadableMap value) {
        view.setCamera(value);
    }

    @Override
    public void setCompassOffset(MapView view, @Nullable ReadableMap value) {
        // not supported
    }

    @Override
    public void setFollowsUserLocation(MapView view, boolean value) {
        // not supported
    }

    @Override
    public void setPoiClickEnabled(MapView view, boolean value) {
        view.setPoiClickEnabled(value);
    }

    @Override
    public void setInitialCamera(MapView view, @Nullable ReadableMap value) {
        CameraPosition camera = MapView.cameraPositionFromMap(value);
        if (camera != null) {
            view.setInitialCameraSet(true);
        }
    }


    @Override
    public void setInitialRegion(MapView view, @Nullable ReadableMap value) {
        view.setInitialRegion(value);
    }

    @Override
    public void setKmlSrc(MapView view, @Nullable String value) {
        view.setKmlSrc(value);
    }

    @Override
    public void setLegalLabelInsets(MapView view, @Nullable ReadableMap value) {
        // not supported
    }

    @Override
    public void setLiteMode(MapView view, boolean value) {

    }

    @Override
    public void setGoogleMapId(MapView view, @Nullable String value) {
        // do nothing (initialProp)

    }

    @Override
    public void setGoogleRenderer(MapView view, @Nullable String value) {
        if (!rendererInitialized) {
            MapsInitializer.Renderer renderer = MapsInitializer.Renderer.LATEST;
            if ("LEGACY".equals(value)) {
                renderer = MapsInitializer.Renderer.LEGACY;
            }
            MapsInitializer.initialize(getReactApplicationContext(), renderer, r -> Log.d("AirMapRenderer", "Init with renderer: " + r));
            rendererInitialized = true;
        }

    }

    @Override
    public void setLoadingBackgroundColor(MapView view, @Nullable Integer value) {
        view.setLoadingBackgroundColor(value);
    }

    @Override
    public void setLoadingEnabled(MapView view, boolean value) {
        view.setLoadingEnabled(value);
    }

    @Override
    public void setLoadingIndicatorColor(MapView view, @Nullable Integer value) {
        view.setLoadingIndicatorColor(value);
    }

    @Override
    public void setMapPadding(MapView view, @Nullable ReadableMap padding) {
        int left = 0;
        int top = 0;
        int right = 0;
        int bottom = 0;
        double density = (double) view.getResources().getDisplayMetrics().density;

        if (padding != null) {
            if (padding.hasKey("left")) {
                left = (int) (padding.getDouble("left") * density);
            }

            if (padding.hasKey("top")) {
                top = (int) (padding.getDouble("top") * density);
            }

            if (padding.hasKey("right")) {
                right = (int) (padding.getDouble("right") * density);
            }

            if (padding.hasKey("bottom")) {
                bottom = (int) (padding.getDouble("bottom") * density);
            }
        }

        view.applyBaseMapPadding(left, top, right, bottom);
        view.map.setPadding(left, top, right, bottom);
    }

    @Override
    public void addView(MapView parent, View child, int index) {
        parent.addFeature(child, index);
    }

    @Override
    public void setMapType(MapView view, @Nullable String value) {
        view.setMapType(mapTypeFromStrValue(value));
    }

    private static int mapTypeFromStrValue(String value) {
        int mapType;
        //hybrid | none | satellite | standard | terrain
        if ("hybrid".equals(value)) {
            mapType = GoogleMap.MAP_TYPE_HYBRID;
        } else if ("none".equals(value)) {
            mapType = GoogleMap.MAP_TYPE_NONE;
        } else if ("satellite".equals(value)) {
            mapType = GoogleMap.MAP_TYPE_SATELLITE;
        } else if ("standard".equals(value)) {
            mapType = GoogleMap.MAP_TYPE_NORMAL;
        } else if ("terrain".equals(value)) {
            mapType = GoogleMap.MAP_TYPE_TERRAIN;
        } else {
            mapType = GoogleMap.MAP_TYPE_NORMAL;
        }
        return mapType;
    }

    @Override
    public void setMaxDelta(MapView view, double value) {
        // not supported
    }

    @Override
    public void setMaxZoom(MapView view, float value) {
        view.setMaxZoomLevel(value);
    }

    @Override
    public void setMinDelta(MapView view, double value) {
        // not supported
    }

    @Override
    public void setMinZoom(MapView view, float value) {
        view.setMinZoomLevel(value);
    }

    @Override
    public void setMoveOnMarkerPress(MapView view, boolean value) {
        view.setMoveOnMarkerPress(value);
    }

    @Override
    public void setHandlePanDrag(MapView view, boolean value) {
        view.setHandlePanDrag(value);
    }

    @Override
    public void setPaddingAdjustmentBehavior(MapView view, @Nullable String value) {
        // not supported
    }

    @Override
    public void setPitchEnabled(MapView view, boolean value) {
        view.setPitchEnabled(value);
    }

    @Override
    public void setRegion(MapView view, @Nullable ReadableMap value) {
        view.setRegion(value);
    }

    @Override
    public void setRotateEnabled(MapView view, boolean value) {
        view.setRotateEnabled(value);
    }

    @Override
    public void setScrollDuringRotateOrZoomEnabled(MapView view, boolean value) {
        view.setScrollDuringRotateOrZoomEnabled(value);
    }

    @Override
    public void setScrollEnabled(MapView view, boolean value) {
        view.setScrollEnabled(value);
    }

    @Override
    public void setShowsBuildings(MapView view, boolean value) {
        view.setShowBuildings(value);
    }

    @Override
    public void setShowsCompass(MapView view, boolean value) {
        view.setShowsCompass(value);
    }

    @Override
    public void setShowsIndoorLevelPicker(MapView view, boolean value) {
        view.setShowsIndoorLevelPicker(value);
    }

    @Override
    public void setShowsIndoors(MapView view, boolean value) {
        view.setShowIndoors(value);
    }

    @Override
    public void setShowsMyLocationButton(MapView view, boolean value) {
        view.setShowsMyLocationButton(value);
    }

    @Override
    public void setShowsScale(MapView view, boolean value) {
        // not supported
    }

    @Override
    public void setShowsUserLocation(MapView view, boolean value) {
        view.setShowsUserLocation(value);
    }

    @Override
    public void setTintColor(MapView view, @Nullable Integer value) {
        // not supported
    }

    @Override
    public void setToolbarEnabled(MapView view, boolean value) {
        view.setToolbarEnabled(value);
    }

    @Override
    public void setUserInterfaceStyle(MapView view, @Nullable String value) {
        // todo update google maps SDK and add support for MapColorScheme
    }

    @Override
    public void setUserLocationAnnotationTitle(MapView view, @Nullable String value) {
        // not supported
    }

    @Override
    public void setUserLocationCalloutEnabled(MapView view, boolean value) {
        // not supported
    }

    @Override
    public void setUserLocationFastestInterval(MapView view, int value) {
        view.setUserLocationFastestInterval(value);
    }

    @Override
    public void setUserLocationPriority(MapView view, @Nullable String value) {
        view.setUserLocationPriority(MY_LOCATION_PRIORITY.get(value));
    }

    @Override
    public void setUserLocationUpdateInterval(MapView view, int value) {
        view.setUserLocationUpdateInterval(value);
    }

    @Override
    public void setZoomControlEnabled(MapView view, boolean value) {
        view.setZoomControlEnabled(value);
    }

    @Override
    public void setZoomEnabled(MapView view, boolean value) {
        view.setZoomEnabled(value);
    }

    @Override
    public void setZoomTapEnabled(MapView view, boolean value) {
        // not supported
    }

    @Override
    public void setCameraZoomRange(MapView view, @Nullable ReadableMap value) {
        // not supported
    }

    @Override
    public void animateToRegion(MapView view, String regionJSON, int duration) {

    }

    @Override
    public void setCamera(MapView view, String cameraJSON) {

    }

    @Override
    public void animateCamera(MapView view, String cameraJSON, int duration) {

    }

    @Override
    public void fitToElements(MapView view, String edgePaddingJSON, boolean animated) {

    }

    @Override
    public void fitToSuppliedMarkers(MapView view, String markersJSON, String edgePaddingJSON, boolean animated) {

    }

    @Override
    public void fitToCoordinates(MapView view, String coordinatesJSON, String edgePaddingJSON, boolean animated) {

    }

    @Override
    public void onDropViewInstance(MapView view) {
        super.onDropViewInstance(view);
        view.onDestroy();
    }
}
