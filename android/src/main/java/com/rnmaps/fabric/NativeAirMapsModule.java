package com.rnmaps.fabric;

import com.facebook.fbreact.specs.NativeAirMapsModuleSpec;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.google.android.gms.maps.model.CameraPosition;
import com.rnmaps.maps.MapView;

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
            UIManager uiManager = UIManagerHelper.getUIManagerForReactTag(getReactApplicationContext(), (int) tag);
            getReactApplicationContext().runOnUiQueueThread(new Runnable() {
                @Override
                public void run() {
                    MapView view = (MapView) uiManager.resolveView((int) tag);
                    CameraPosition position = view.map.getCameraPosition();
                    WritableMap map = Arguments.createMap();
                    WritableMap center = Arguments.createMap();
                    center.putDouble("latitude", position.target.latitude);
                    center.putDouble("longitude", position.target.longitude);
                    map.putMap("center", center);
                    map.putDouble("heading", position.bearing);
                    map.putDouble("pitch", position.tilt);
                    map.putDouble("zoom", position.zoom);
                    promise.resolve(map);
                }
            });
    }

    @Override
    public void getMarkersFrames(double tag, boolean onlyVisible, Promise promise) {

    }

    @Override
    public void getMapBoundaries(double tag, Promise promise) {

    }

    @Override
    public void takeSnapshot(double tag, String config, Promise promise) {

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
