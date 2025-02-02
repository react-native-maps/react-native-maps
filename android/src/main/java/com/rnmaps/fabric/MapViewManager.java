package com.rnmaps.fabric;


import static com.rnmaps.maps.MapManager.MY_LOCATION_PRIORITY;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMapViewManagerInterface;
import com.facebook.react.viewmanagers.RNMapsMapViewManagerDelegate;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.rnmaps.maps.MapView;

import java.util.Map;

@ReactModule(name = MapViewManager.REACT_CLASS)
public class MapViewManager extends ViewGroupManager<MapView> implements RNMapsMapViewManagerInterface<MapView> {


    public MapViewManager(ReactApplicationContext context) {
        super(context);
    }
    private GoogleMapOptions options;
    private final RNMapsMapViewManagerDelegate<MapView, MapViewManager> delegate =
            new RNMapsMapViewManagerDelegate<>(this);

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
        return new MapView(context, options);
    }


    public static final String REACT_CLASS = "RNMapsMapView";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapView.getExportedCustomBubblingEventTypeConstants();
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
        view.setInitialCamera(value);
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

    }

    @Override
    public void setGoogleRenderer(MapView view, @Nullable String value) {

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
        //hybrid | none | satellite | standard | terrain
        if ("hybrid".equals(value)) {
            view.setMapType(GoogleMap.MAP_TYPE_HYBRID);
        } else if ("none".equals(value)) {
            view.setMapType(GoogleMap.MAP_TYPE_NONE);
        } else if ("satellite".equals(value)) {
            view.setMapType(GoogleMap.MAP_TYPE_SATELLITE);
        } else if ("standard".equals(value)) {
            view.setMapType(GoogleMap.MAP_TYPE_NORMAL);
        } else if ("terrain".equals(value)) {
            view.setMapType(GoogleMap.MAP_TYPE_TERRAIN);
        }
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
        // not supported
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
}
