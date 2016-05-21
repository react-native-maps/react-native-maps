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
        view.setPoints(points);
    }
}
