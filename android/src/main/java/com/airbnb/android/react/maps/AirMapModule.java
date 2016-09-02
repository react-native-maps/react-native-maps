package com.airbnb.android.react.maps;

import android.app.Activity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class AirMapModule extends ReactContextBaseJavaModule {

    public AirMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AirMapModule";
    }

    public Activity getActivity() {
        return getCurrentActivity();
    }
}
