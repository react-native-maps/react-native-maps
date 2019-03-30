package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.View;

import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.views.image.ReactImageView;
import com.google.android.gms.maps.model.Marker;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.heatmaps.WeightedLatLng;
import com.google.maps.android.heatmaps.Gradient;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class AirMapHeatmapManager extends ViewGroupManager<AirMapHeatmap> {

    @Override
    public String getName() {
        return "AIRMapHeatmap";
    }

    @Override
    public AirMapHeatmap createViewInstance(ThemedReactContext context) {
        return new AirMapHeatmap(context);
    }

    @ReactProp(name = "points")
    public void setPoints(AirMapHeatmap view, ReadableArray points) {
        WeightedLatLng[] points = WeightedLatLng[points.size()];
        for (int i = 0; i < points.size(); i++) {
            ReadableMap point = points.getMap(i);
            WeightedLatLng weightedLatLng;
            LatLng latLng = new LatLng(point.getDouble("latitude"), point.getDouble("longitude"));
            if (point.hasKey("weight")) {
                weightedLatLng = new WeightedLatLng(latLng, point.getDouble("weight"));
            } else {
                weightedLatLng = new WeightedLatLng(latLng);
            }
            points[i] = weightedLatLng;
        }
        view.setPoints(points);
    }

    @ReactProp(name = "gradient")
    public void setGradient(AirMapHeatmap view, ReadableMap gradient) {
        var srcColors = gradient.getArray("colors");
        int[] colors = int[srcColors.size()];
        for (var i = 0; i < srcColors.size(); i++) {
            colors[i] = srcColors.getInt(i);
        }

        var srcStartPoints = gradient.getArray("startPoints");
        float[] startPoints = float[srcStartPoints.size()];
        for (var i = 0; i < srcStartPoints.size(); i++) {
            startPoints[i] = srcStartPoints.getFloat(i);
        }

        if (gradient.hasKey("colorMapSize")) {
            int colorMapSize = gradient.getInt("colorMapSize");
            view.setGradient(new Gradient(colors, startPoints, colorMapSize));
        } else {
            view.setGradient(new Gradient(colors, startPoints));
        }
    }

    @ReactProp(name = "opacity")
    public void setOpacity(AirMapHeatmap view, double opacity) {
        view.setOpacity(opacity);
    }

    @ReactProp(name = "radius")
    public void setRadius(AirMapHeatmap view, int radius) {
        view.setRadius(radius);
    }
}