package com.rnmaps.fabric;


import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMapViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMapViewManagerInterface;
import com.facebook.react.viewmanagers.RNMapsMarkerManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMarkerManagerInterface;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.model.LatLng;
import com.rnmaps.maps.MapMarker;
import com.rnmaps.maps.MapView;

import java.util.Map;

@ReactModule(name = MarkerManager.REACT_CLASS)
public class MarkerManager extends ViewGroupManager<MapMarker> implements RNMapsMarkerManagerInterface<MapMarker> {


    public MarkerManager(ReactApplicationContext context){
        super(context);
    }
    private GoogleMapOptions options;
    private final RNMapsMarkerManagerDelegate<MapMarker, MarkerManager> delegate =
            new RNMapsMarkerManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapMarker> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapMarker createViewInstance(ThemedReactContext context) {
        return new MapMarker(context, null);
    }


    public static final String REACT_CLASS = "RNMapsMarker";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapMarker.getExportedCustomBubblingEventTypeConstants();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapMarker.getExportedCustomDirectEventTypeConstants();
    }

    @Override
    public void setAnchor(MapMarker view, @Nullable ReadableMap map) {
        double x = map != null && map.hasKey("x") ? map.getDouble("x") : 0.5;
        double y = map != null && map.hasKey("y") ? map.getDouble("y") : 1.0;
        view.setAnchor(x, y);
    }

    @Override
    public void setCalloutAnchor(MapMarker view, @Nullable ReadableMap value) {

    }

    @Override
    public void setImage(MapMarker view, @Nullable ReadableMap value) {

    }

    @Override
    public void setCalloutOffset(MapMarker view, @Nullable ReadableMap value) {

    }

    @Override
    public void setDisplayPriority(MapMarker view, @Nullable String value) {

    }

    @Override
    public void setCoordinate(MapMarker view, @Nullable ReadableMap value) {
        view.setCoordinate(value);
    }

    @Override
    public void setDescription(MapMarker view, @Nullable String value) {

    }

    @Override
    public void setDraggable(MapMarker view, boolean value) {
        view.setDraggable(value);
    }

    @Override
    public void setTitle(MapMarker view, @Nullable String value) {
        view.setTitle(value);
    }

    @Override
    public void setIdentifier(MapMarker view, @Nullable String value) {
        view.setIdentifier(value);
    }

    @Override
    public void setIsPreselected(MapMarker view, boolean value) {

    }

    @Override
    public void setOpacity(MapMarker view, double value) {
        view.setOpacity((float) value);
    }

    @Override
    public void setPinColor(MapMarker view, @Nullable Integer value) {

    }

    @Override
    public void setTitleVisibility(MapMarker view, @Nullable String value) {

    }

    @Override
    public void setSubtitleVisibility(MapMarker view, @Nullable String value) {

    }

    @Override
    public void setUseLegacyPinView(MapMarker view, boolean value) {

    }

    @Override
    public void animateToCoordinates(MapMarker view, double latitude, double longitude, int duration) {

    }

    @Override
    public void setCoordinates(MapMarker view, double latitude, double longitude) {
            view.setCoordinate(new LatLng(latitude, longitude));
    }

    @Override
    public void showCallout(MapMarker view) {

    }

    @Override
    public void hideCallout(MapMarker view) {

    }

    @Override
    public void redrawCallout(MapMarker view) {

    }

    @Override
    public void redraw(MapMarker view) {

    }
}