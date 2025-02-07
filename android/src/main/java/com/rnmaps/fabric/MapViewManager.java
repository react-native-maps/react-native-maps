package com.rnmaps.fabric;


import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.LayoutShadowNode;
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

import java.util.List;
import java.util.Map;

@ReactModule(name = MapViewManager.REACT_CLASS)
public class MapViewManager extends ViewGroupManager<MapViewWrapper> implements RNMapsMapViewManagerInterface<MapViewWrapper> {

    private GoogleMapOptions options;
    private boolean rendererInitialized = false;
    private final RNMapsMapViewManagerDelegate<MapViewWrapper, MapViewManager> delegate =
            new RNMapsMapViewManagerDelegate<>(this);


    public MapViewManager(ReactApplicationContext context) {
        super(context);
        options = new GoogleMapOptions();
    }


    @Override
    public ViewManagerDelegate<MapViewWrapper> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapViewWrapper createViewInstance(ThemedReactContext context) {
        Log.e(MapViewManager.class.getName(), "createViewInstance");
        return new MapViewWrapper(context);
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
    public void setCacheEnabled(MapViewWrapper view, boolean value) {
        view.setCacheEnabled(value);
    }

    @Override
    public void setCamera(MapViewWrapper view, @Nullable ReadableMap value) {
        view.setCamera(value);
    }

    @Override
    public void setCompassOffset(MapViewWrapper view, @Nullable ReadableMap value) {
        // not supported
    }

    @Override
    public void setFollowsUserLocation(MapViewWrapper view, boolean value) {
        // not supported
    }

    @Override
    public void setPoiClickEnabled(MapViewWrapper view, boolean value) {
        view.setPoiClickEnabled(value);
    }

    @Override
    public void setInitialCamera(MapViewWrapper view, @Nullable ReadableMap value) {
        CameraPosition camera = MapView.cameraPositionFromMap(value);
        if (camera != null){
            options.camera(camera);
            view.setInitialCameraSet(true);
        }
    }

    @Override
    protected MapViewWrapper recycleView(@NonNull ThemedReactContext var1, @NonNull MapViewWrapper wrapper){
        wrapper.prepareToRecycleView();
        return wrapper;
    }


    @Override
    public void setInitialRegion(MapViewWrapper view, @Nullable ReadableMap value) {
        view.setInitialRegion(value);
    }

    @Override
    public void setKmlSrc(MapViewWrapper view, @Nullable String value) {
        view.setKmlSrc(value);
    }

    @Override
    public void setLegalLabelInsets(MapViewWrapper view, @Nullable ReadableMap value) {
        // not supported
    }

    @Override
    public void setLiteMode(MapViewWrapper view, boolean value) {
        options.liteMode(value);
    }

    @Override
    public void setGoogleMapId(MapViewWrapper view, @Nullable String value) {
        options.mapId(value);
    }

    @Override
    public void setGoogleRenderer(MapViewWrapper view, @Nullable String value) {
        if (!rendererInitialized) {
            MapsInitializer.Renderer renderer =  MapsInitializer.Renderer.LATEST;
            if ("LEGACY".equals(value)){
                renderer = MapsInitializer.Renderer.LEGACY;
            }
            MapsInitializer.initialize(getReactApplicationContext(), renderer, r -> Log.d("AirMapRenderer", "Init with renderer: " + r));
            rendererInitialized = true;
        }

    }

    @Override
    public void setLoadingBackgroundColor(MapViewWrapper view, @Nullable Integer value) {
        view.setLoadingBackgroundColor(value);
    }

    @Override
    public void setLoadingEnabled(MapViewWrapper view, boolean value) {
        view.setLoadingEnabled(value);
    }

    @Override
    public void setLoadingIndicatorColor(MapViewWrapper view, @Nullable Integer value) {
        view.setLoadingIndicatorColor(value);
    }

    @Override
    public void setMapPadding(MapViewWrapper view, @Nullable ReadableMap padding) {
        view.setMapPadding(padding);
    }

    @Override
    public void addView(MapViewWrapper parent, View child, int index) {
        parent.getMapView().addFeature(child, index);
        Log.e("MapViewManager", "addView  " + child.getId() + " at index: " + index);

    }
    @Override
    public void addViews(MapViewWrapper parent, List<View> views){
        for (View view : views){
            parent.getMapView().addView(view);
            Log.e("MapViewManager", "addViews  " + view.getId());
        }

    }


    @Override
    public void setMapType(MapViewWrapper view, @Nullable String value) {
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
        options.mapType(mapType);
        if (view.getMapView() != null){
            view.getMapView().setMapType(mapType);
        }
    }

    @Override
    public void setMaxDelta(MapViewWrapper view, double value) {
        // not supported
    }

    @Override
    public void setMaxZoom(MapViewWrapper view, float value) {
        options.maxZoomPreference(value);
        if (view.getMapView() != null) {
            view.getMapView().setMaxZoomLevel(value);
        }
    }

    @Override
    public void setMinDelta(MapViewWrapper view, double value) {
        // not supported
    }

    @Override
    public void setMinZoom(MapViewWrapper view, float value) {
        options.minZoomPreference(value);
        if (view.getMapView() != null) {
            view.getMapView().setMinZoomLevel(value);
        }
    }

    @Override
    public void setMoveOnMarkerPress(MapViewWrapper view, boolean value) {
            view.setMoveOnMarkerPress(value);
    }

    @Override
    public void setHandlePanDrag(MapViewWrapper view, boolean value) {
        view.setHandlePanDrag(value);
    }

    @Override
    public void setPaddingAdjustmentBehavior(MapViewWrapper view, @Nullable String value) {
        // not supported
    }

    @Override
    public void setPitchEnabled(MapViewWrapper view, boolean value) {
        options.tiltGesturesEnabled(value);
        if (view.getMapView() != null) {
            view.getMapView().setPitchEnabled(value);
        }
    }

    @Override
    public void setRegion(MapViewWrapper view, @Nullable ReadableMap value) {
        view.setRegion(value);
    }

    @Override
    public void setRotateEnabled(MapViewWrapper view, boolean value) {
        options.rotateGesturesEnabled(value);
        if (view.getMapView() != null) {
            view.getMapView().setRotateEnabled(value);
        }
    }

    @Override
    public void setScrollDuringRotateOrZoomEnabled(MapViewWrapper view, boolean value) {
        options.scrollGesturesEnabledDuringRotateOrZoom(value);
        if (view.getMapView() != null) {
            view.getMapView().setScrollDuringRotateOrZoomEnabled(value);
        }
    }

    @Override
    public void setScrollEnabled(MapViewWrapper view, boolean value) {
        options.scrollGesturesEnabled(value);
        if (view.getMapView() != null) {
            view.getMapView().setScrollEnabled(value);
        }
    }

    @Override
    public void setShowsBuildings(MapViewWrapper view, boolean value) {
        view.setShowsBuildings(value);
    }

    @Override
    public void setShowsCompass(MapViewWrapper view, boolean value) {
        options.compassEnabled(value);
        view.setShowsCompass(value);
    }

    @Override
    public void setShowsIndoorLevelPicker(MapViewWrapper view, boolean value) {
        view.setShowsIndoorLevelPicker(value);
    }

    @Override
    public void setShowsIndoors(MapViewWrapper view, boolean value) {
        view.setShowsIndoors(value);
    }

    @Override
    public void setShowsMyLocationButton(MapViewWrapper view, boolean value) {
        view.setShowsMyLocationButton(value);
    }

    @Override
    public void setShowsScale(MapViewWrapper view, boolean value) {
        // not supported
    }

    @Override
    public void setShowsUserLocation(MapViewWrapper view, boolean value) {
        view.setShowsUserLocation(value);
    }

    @Override
    public void setTintColor(MapViewWrapper view, @Nullable Integer value) {
        // not supported
    }

    @Override
    public void setToolbarEnabled(MapViewWrapper view, boolean value) {
        options.mapToolbarEnabled(value);
        if (view.getMapView() != null) {
            view.getMapView().setToolbarEnabled(value);
        }
    }

    @Override
    public void setUserInterfaceStyle(MapViewWrapper view, @Nullable String value) {
        // todo update google maps SDK and add support for MapColorScheme
    }

    @Override
    public void setUserLocationAnnotationTitle(MapViewWrapper view, @Nullable String value) {
        // not supported
    }

    @Override
    public void setUserLocationCalloutEnabled(MapViewWrapper view, boolean value) {
        // not supported
    }

    @Override
    public void setUserLocationFastestInterval(MapViewWrapper view, int value) {
        view.setUserLocationFastestInterval(value);
    }

    @Override
    public void setUserLocationPriority(MapViewWrapper view, @Nullable String value) {
        view.setUserLocationPriority(value);
    }

    @Override
    public void setUserLocationUpdateInterval(MapViewWrapper view, int value) {
        view.setUserLocationUpdateInterval(value);
    }

    @Override
    public void setZoomControlEnabled(MapViewWrapper view, boolean value) {
        options.zoomControlsEnabled(value);
        if (view.getMapView() != null) {
            view.setZoomControlEnabled(value);
        }
    }

    @Override
    public void setZoomEnabled(MapViewWrapper view, boolean value) {
        options.zoomGesturesEnabled(value);
        if (view.getMapView() != null) {
            view.setZoomEnabled(value);
        }
    }

    @Override
    public void setZoomTapEnabled(MapViewWrapper view, boolean value) {
        // not supported
    }

    @Override
    public void setCameraZoomRange(MapViewWrapper view, @Nullable ReadableMap value) {
        // not supported
    }

    @Override
    public void animateToRegion(MapViewWrapper view, String regionJSON, int duration) {

    }

    @Override
    public void setCamera(MapViewWrapper view, String cameraJSON) {

    }

    @Override
    public void animateCamera(MapViewWrapper view, String cameraJSON, int duration) {

    }

    @Override
    public void fitToElements(MapViewWrapper view, String edgePaddingJSON, boolean animated) {

    }

    @Override
    public void fitToSuppliedMarkers(MapViewWrapper view, String markersJSON, String edgePaddingJSON, boolean animated) {

    }

    @Override
    public void fitToCoordinates(MapViewWrapper view, String coordinatesJSON, String edgePaddingJSON, boolean animated) {

    }
    @Override
    public int getChildCount(MapViewWrapper parent) {
        if (parent.getMapView() != null) {
            return parent.getMapView().getChildCount();
        }
        return 0;
    }

    @Override
    public View getChildAt(MapViewWrapper parent, int index) {
        if (parent.getMapView() != null) {
            return parent.getMapView().getChildAt(index);
        }
        return null;
    }

    @Override
    public void removeViewAt(MapViewWrapper parent, int index) {
        if (parent.getMapView() != null) {
            parent.getMapView().removeViewAt(index);
        }
    }

    public void removeView(MapViewWrapper parent, View view) {
        if (parent.getMapView() != null) {
            parent.getMapView().removeView(view);
        }
    }


    @Override
    protected void onAfterUpdateTransaction(@NonNull MapViewWrapper view) {
        super.onAfterUpdateTransaction(view);
        setGoogleRenderer(view, null);
        view.initializeMapView(options);
        options = new GoogleMapOptions();
        Log.e("MapViewManager", "onAfterUpdateTransaction tag: " + view.getId());
    }
    @Override
    public void onDropViewInstance(MapViewWrapper view) {
        super.onDropViewInstance(view);
        view.prepareToRecycleView();
    }
}
