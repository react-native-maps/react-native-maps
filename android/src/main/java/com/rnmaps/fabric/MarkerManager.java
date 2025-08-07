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
import com.google.android.gms.maps.model.MarkerOptions;
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
    private MarkerOptions optionsForInitialProps(ReactStylesDiffMap initialProps){
        MarkerOptions options = new MarkerOptions();
        if (initialProps != null) {
            if (initialProps.hasKey("opacity")) {
                options.alpha(initialProps.getFloat("opacity", 1));
            }
            if (initialProps.hasKey("anchor")) {
                ReadableMap map = initialProps.getMap("anchor");
                float x = (float) (map != null && map.hasKey("x") ? map.getDouble("x") : 0.5);
                float y = (float) (map != null && map.hasKey("y") ? map.getDouble("y") : 1.0);
                options.anchor(x, y);
            }

            if (initialProps.hasKey("coordinate")) {
                ReadableMap coordinate = initialProps.getMap("coordinate");
                LatLng position = new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
                options.position(position);
            }
            if (initialProps.hasKey("title")) {
                options.title(initialProps.getString("title"));
            }
            if (initialProps.hasKey("description")) {
                options.snippet(initialProps.getString("description"));
            }
            if (initialProps.hasKey("draggable")){
                options.draggable(initialProps.getBoolean("draggable", false));
            }
            if (initialProps.hasKey("rotation")){
                options.rotation(initialProps.getFloat("rotation", 0));
            }
            if (initialProps.hasKey("flat")) {
                options.flat(initialProps.getBoolean("flat", false));
            }
            if (initialProps.hasKey("calloutAnchor")){
                ReadableMap map = initialProps.getMap("calloutAnchor");
                float x = (float) (map != null && map.hasKey("x") ? map.getDouble("x") : 0.5);
                float y = (float) (map != null && map.hasKey("y") ? map.getDouble("y") : 1.0);
                options.infoWindowAnchor(x, y);
            }

            if (initialProps.hasKey("zIndex")){
                options.zIndex(initialProps.getFloat("zIndex", 0));
            }
        }
        return options;
    }

    @Override
    protected MapMarker createViewInstance(int reactTag, @NonNull ThemedReactContext reactContext, @Nullable ReactStylesDiffMap initialProps, @Nullable StateWrapper stateWrapper) {
        MapMarker view = null;
        view = new MapMarker(reactContext, optionsForInitialProps(initialProps), null);
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
        view.setUpdated(true);
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
        view.setUpdated(true);
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
        view.setUpdated(true);
    }

    @Override
    public void setDescription(MapMarker view, @Nullable String value) {
        view.setSnippet(value);
        view.setUpdated(true);
    }

    @Override
    public void setDraggable(MapMarker view, boolean value) {
        view.setDraggable(value);
        view.setUpdated(true);
    }

    @Override
    public void setTitle(MapMarker view, @Nullable String value) {
        view.setTitle(value);
        view.setUpdated(true);
    }

    @Override
    public void setTracksViewChanges(MapMarker view, boolean value) {
        view.setTracksViewChanges(value);
    }

    @Override
    public void setIdentifier(MapMarker view, @Nullable String value) {
        view.setIdentifier(value);
        view.setUpdated(true);
    }

    @Override
    public void setIsPreselected(MapMarker view, boolean value) {

    }

    @Override
    public void setOpacity(MapMarker view, double value) {
        view.setOpacity((float) value);
        view.setUpdated(true);
    }

    @Override
    public void setPinColor(MapMarker view, @Nullable Integer value) {
        float[] hsv = new float[3];
        Color.colorToHSV(value, hsv);
        // NOTE: android only supports a hue
        view.setMarkerHue(hsv[0]);
        view.setUpdated(true);
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
        view.setUpdated(true);
    }

    @Override
    public void showCallout(MapMarker view) {
        ((Marker) view.getFeature()).showInfoWindow();
        view.setUpdated(true);
    }

    @Override
    public void hideCallout(MapMarker view) {
        ((Marker) view.getFeature()).hideInfoWindow();
        view.setUpdated(true);
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
            super.addView(parent, child, index);
            if (index == 0) {
                child.addOnLayoutChangeListener(new View.OnLayoutChangeListener() {
                    @Override
                    public void onLayoutChange(View v, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {
                        int newWidth = right - left;
                        int newHeight = bottom - top;
                        MapMarker marker = (MapMarker) v.getParent();
                        marker.update(newWidth, newHeight);
                    }
                });
            }
            parent.update(true);
        }
    }
}
