package com.AirMaps;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.google.android.gms.maps.model.LatLng;

public class AirMapUrlTileManager extends ViewGroupManager<AirMapUrlTile> {
    private DisplayMetrics metrics;

    public AirMapUrlTileManager(ReactApplicationContext reactContext) {
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
        return "AIRMapUrlTile";
    }

    @Override
    public AirMapUrlTile createViewInstance(ThemedReactContext context) {
        return new AirMapUrlTile(context);
    }

    @ReactProp(name = "url")
    public void setCenter(AirMapUrlTile view, String url) {
        view.setUrl(url);
    }

    @ReactProp(name = "zIndex", defaultFloat = -1.0f)
    public void setZIndex(AirMapUrlTile view, float zIndex) {
        view.setZIndex(zIndex);
    }

}
