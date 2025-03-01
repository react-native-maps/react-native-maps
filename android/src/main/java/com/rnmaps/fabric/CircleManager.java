package com.rnmaps.fabric;


import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsCircleManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsCircleManagerInterface;
import com.rnmaps.maps.MapCircle;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = CircleManager.REACT_CLASS)
public class CircleManager extends ViewGroupManager<MapCircle> implements RNMapsCircleManagerInterface<MapCircle> {
    public CircleManager(ReactApplicationContext context) {
        super(context);
    }

    private final RNMapsCircleManagerDelegate<MapCircle, CircleManager> delegate =
            new RNMapsCircleManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapCircle> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapCircle createViewInstance(ThemedReactContext context) {
        return new MapCircle(context);
    }


    public static final String REACT_CLASS = "RNMapsCircle";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapCircle.getExportedCustomBubblingEventTypeConstants();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return new HashMap<>();
    }



    @Override
    public void setZIndex(MapCircle view, float value) {
        view.setZIndex(value);
    }

    @Override
    public void setCenter(MapCircle view, @Nullable ReadableMap value) {
        view.setCenter(value);
    }

    @Override
    public void setFillColor(MapCircle view, @Nullable Integer value) {
        view.setFillColor(value);
    }

    @Override
    public void setRadius(MapCircle view, double value) {
        view.setRadius(value);
    }

    @Override
    public void setStrokeColor(MapCircle view, @Nullable Integer value) {
        view.setStrokeColor(value);
    }

    @Override
    public void setStrokeWidth(MapCircle view, float value) {
            view.setStrokeWidth(value);
    }

    @Override
    public void setTappable(MapCircle view, boolean value) {
            view.setTappable(value);
    }
}
