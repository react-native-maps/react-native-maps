package com.rnmaps.fabric;


import android.graphics.Color;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMarkerManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsMarkerManagerInterface;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.rnmaps.maps.MapCallout;
import com.rnmaps.maps.MapMarker;

import java.util.Map;

@ReactModule(name = MarkerManager.REACT_CLASS)
public class MarkerManager extends ViewGroupManager<MapMarker> implements RNMapsMarkerManagerInterface<MapMarker> {


    public MarkerManager(ReactApplicationContext context){
        super(context);
    }
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
    @Override
    protected MapMarker createViewInstance(int reactTag, @NonNull ThemedReactContext reactContext, @Nullable ReactStylesDiffMap initialProps, @Nullable StateWrapper stateWrapper) {
        // We don't build MarkerOptions from the initial props.
        // updateProperties() sends the first values through the same setters
        // as later changes, so changes after creation apply too.
        MapMarker view = new MapMarker(reactContext, null);
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
        if (value != null && value.hasKey("uri")) {
            view.setImage(value.getString("uri"));
        } else {
            view.setImage(null);
        }
    }

    @Override
    public void onDropViewInstance(MapMarker view) {
        super.onDropViewInstance(view);
        view.doDestroy();
    }

    @Override
    public void setCalloutOffset(MapMarker view, @Nullable ReadableMap value) {

    }

    @Override
    public void setDisplayPriority(MapMarker view, @Nullable String value) {

    }

    @Override
    public void setCenterOffset(MapMarker view, @Nullable ReadableMap value) {
    }

    @Override
    public void setCoordinate(MapMarker view, @Nullable ReadableMap value) {
        view.setCoordinate(value);
    }

    @Override
    public void setDescription(MapMarker view, @Nullable String value) {
        view.setSnippet(value);
    }

    @Override
    public void setDraggable(MapMarker view, boolean value) {
        view.setDraggable(value);
    }

    /**
     * zIndex is a style prop that every view has, so the generated delegate
     * sends it to BaseViewManager, which only orders Android views. Pass it on
     * to the Google marker too, so Google Maps draws markers in zIndex order.
     */
    @Override
    public void setZIndex(@NonNull MapMarker view, float zIndex) {
        super.setZIndex(view, zIndex);
        // MapMarker.setZIndex() takes an int. Our zIndex values are already
        // integers, so rounding only converts the type.
        view.setZIndex(Math.round(zIndex));
    }

    @Override
    public void setFlat(MapMarker view, boolean value) {
        view.setFlat(value);
    }

    @Override
    public void setTitle(MapMarker view, @Nullable String value) {
        view.setTitle(value);
    }

    @Override
    public void setTracksViewChanges(MapMarker view, boolean value) {
        view.setTracksViewChanges(value);
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
        float[] hsv = new float[3];
        Color.colorToHSV(value, hsv);
        // NOTE: android only supports a hue
        view.setMarkerHue(hsv[0]);
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
        view.animateToCoodinate(new LatLng(latitude, longitude), duration);
    }

    @Override
    public void setCoordinates(MapMarker view, double latitude, double longitude) {
        view.setCoordinate(new LatLng(latitude, longitude));
    }

    @Override
    public void showCallout(MapMarker view) {
        ((Marker) view.getFeature()).showInfoWindow();
    }

    @Override
    public void hideCallout(MapMarker view) {
        ((Marker) view.getFeature()).hideInfoWindow();
    }

    @Override
    public void redrawCallout(MapMarker view) {

    }

    @Override
    public void redraw(MapMarker view) {
        view.redraw();
    }

    @Override
    public void addView(MapMarker parent, View child, int index) {
        // if an <Callout /> component is a child, then it is a callout view, NOT part of the
        // marker.
        if (child instanceof MapCallout) {
            parent.setCalloutView((MapCallout) child);
        } else {
            // MapMarker.addView() redraws the marker once the child is laid out
            super.addView(parent, child, index);
        }
    }
}
