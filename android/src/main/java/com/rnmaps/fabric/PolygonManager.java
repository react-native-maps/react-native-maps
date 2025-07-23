package com.rnmaps.fabric;


import androidx.annotation.Nullable;
import android.util.DisplayMetrics;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsGooglePolygonManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsGooglePolygonManagerInterface;
import com.rnmaps.maps.MapPolygon;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = PolygonManager.REACT_CLASS)
public class PolygonManager extends ViewGroupManager<MapPolygon> implements RNMapsGooglePolygonManagerInterface<MapPolygon> {

    public PolygonManager(ReactApplicationContext context){
        super(context);
    }//
    private final RNMapsGooglePolygonManagerDelegate<MapPolygon, PolygonManager> delegate =
            new RNMapsGooglePolygonManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapPolygon> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapPolygon createViewInstance(ThemedReactContext context) {
        return new MapPolygon(context);
    }



    public static final String REACT_CLASS = "RNMapsGooglePolygon";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapPolygon.getExportedCustomBubblingEventTypeConstants();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return new HashMap<>();
    }


    @Override
    public void setCoordinates(MapPolygon view, @Nullable ReadableArray value) {
        view.setCoordinates(value);
    }

    @Override
    public void setFillColor(MapPolygon view, @Nullable Integer value) {
        view.setFillColor(value);
    }

    @Override
    public void setStrokeColor(MapPolygon view, @Nullable Integer value) {
        view.setStrokeColor(value);
    }

    @Override
    public void setStrokeWidth(MapPolygon view, float value) {
        DisplayMetrics metrics = view.getContext().getResources().getDisplayMetrics();
        float widthInScreenPx = metrics.density * value; // done for parity with iOS
        view.setStrokeWidth(widthInScreenPx);
    }

    @Override
    public void setGeodesic(MapPolygon view, boolean value) {
        view.setGeodesic(value);
    }

    @Override
    public void setHoles(MapPolygon view, @Nullable ReadableArray value) {
        view.setHoles(value);
    }

    @Override
    public void setTappable(MapPolygon view, boolean value) {
            view.setTappable(value);
    }
}