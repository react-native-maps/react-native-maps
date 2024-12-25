package com.rnmaps.fabric;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class NativeAirMapsModule extends NativeAirMapsModuleSpec {
    public NativeAirMapsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void getCamera(double tag, Promise promise) {

    }

    @Override
    public void getMarkersFrames(double tag, boolean onlyVisible, Promise promise) {

    }

    @Override
    public void getMapBoundaries(double tag, Promise promise) {

    }

    @Override
    public void takeSnapshot(double tag, ReadableMap config, Promise promise) {

    }

    @Override
    public void getAddressFromCoordinates(double tag, ReadableMap coordinate, Promise promise) {

    }

    @Override
    public void getPointForCoordinate(double tag, ReadableMap coordinate, Promise promise) {

    }

    @Override
    public void getCoordinateForPoint(double tag, ReadableMap point, Promise promise) {

    }
}
