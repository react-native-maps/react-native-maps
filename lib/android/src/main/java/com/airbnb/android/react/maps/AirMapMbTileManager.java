package com.airbnb.android.react.maps;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by Christoph Lambio on 30/03/2018.
 * Based on AirMapLocalTileManager.java
 * Copyright (c) zavadpe
 */
public class AirMapMbTileManager extends ViewGroupManager<AirMapMbTile> {
    private DisplayMetrics metrics;

    public AirMapMbTileManager(ReactApplicationContext reactContext) {
        super();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            metrics = new DisplayMetrics();
            ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
                    .getDefaultDisplay()
                    .getRealMetrics(metrics);
        } else {
            metrics = reactContext.getResources().getDisplayMetrics();
        }
    }

    @Override
    public String getName() {
        return "AIRMapMbTile";
    }

    @Override
    public AirMapMbTile createViewInstance(ThemedReactContext context) {
        return new AirMapMbTile(context);
    }

    @ReactProp(name = "pathTemplate")
    public void setPathTemplate(AirMapMbTile view, String pathTemplate) { view.setPathTemplate(pathTemplate); }

    @ReactProp(name = "tileSize", defaultFloat = 256f)
    public void setTileSize(AirMapMbTile view, float tileSize) {
        view.setTileSize(tileSize);
    }

    @ReactProp(name = "zIndex", defaultFloat = -1.0f)
    public void setZIndex(AirMapMbTile view, float zIndex) {
        view.setZIndex(zIndex);
    }

}