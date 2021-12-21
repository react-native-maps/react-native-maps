package com.airbnb.android.react.maps;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.maps.MapsInitializer;

public class AirMapNewRendererManager extends AirMapManager {

    private static final String REACT_CLASS = "AIRMapNewRenderer";
    private final ReactApplicationContext appContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public AirMapNewRendererManager(ReactApplicationContext context) {
        super(context);
        this.appContext = context;
    }

    @Override
    protected AirMapView createViewInstance(ThemedReactContext context) {
        MapsInitializer.initialize(context, MapsInitializer.Renderer.LATEST, (MapsInitializer.Renderer renderer) -> {
            Log.d("AirMapNewRenderer", renderer.toString());
        });
        return new AirMapView(context, this.appContext, this, googleMapOptions);
    }

}
