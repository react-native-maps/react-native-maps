package com.rnmaps.fabric;


import android.content.Context;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsPolylineManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsPolylineManagerInterface;
import com.rnmaps.maps.MapPolyline;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = PolylineManager.REACT_CLASS)
public class PolylineManager extends ViewGroupManager<MapPolyline> implements RNMapsPolylineManagerInterface<MapPolyline> {
    private DisplayMetrics metrics;

    public PolylineManager(ReactApplicationContext context) {
        super(context);
        metrics = new DisplayMetrics();
        ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE))
                .getDefaultDisplay()
                .getRealMetrics(metrics);
    }

    private final RNMapsPolylineManagerDelegate<MapPolyline, PolylineManager> delegate =
            new RNMapsPolylineManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapPolyline> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapPolyline createViewInstance(ThemedReactContext context) {
        return new MapPolyline(context);
    }


    public static final String REACT_CLASS = "RNMapsPolyline";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapPolyline.getExportedCustomBubblingEventTypeConstants();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return new HashMap<>();
    }


    @Override
    public void setCoordinates(MapPolyline view, @Nullable ReadableArray value) {
        view.setCoordinates(value);
    }


    @Override
    public void setStrokeColor(MapPolyline view, @Nullable Integer value) {
        view.setColor(value);
    }

    @Override
    public void setStrokeColors(MapPolyline view, @Nullable ReadableArray value) {
        view.setStrokeColors(value);
    }

    @Override
    public void setStrokeWidth(MapPolyline view, float value) {
        float widthInScreenPx = metrics.density * value; // done for parity with iOS
        view.setWidth(widthInScreenPx);
    }

    @Override
    public void setGeodesic(MapPolyline view, boolean value) {
        view.setGeodesic(value);
    }

    @Override
    public void setLineCap(MapPolyline view, @Nullable String value) {
        view.setLineCap(value);
    }

    @Override
    public void setLineDashPattern(MapPolyline view, @Nullable ReadableArray value) {
        view.setLineDashPattern(value);
    }

    @Override
    public void setLineJoin(MapPolyline view, @Nullable String value) {
        view.setLineJoin(value);
    }


    @Override
    public void setTappable(MapPolyline view, boolean value) {
        view.setTappable(value);
    }

    @Override
    public void setZIndex(MapPolyline view, float value) {
        view.setZIndex(value);
    }
}
