package com.rnmaps.maps;

import androidx.annotation.NonNull;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.rnmaps.fabric.MapViewManager;
import com.rnmaps.fabric.MarkerManager;
import com.rnmaps.fabric.NativeAirMapsModule;
import com.facebook.fbreact.specs.NativeAirMapsModuleSpec;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapAirModulePackage extends TurboReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return List.of(new MapViewManager(reactContext), new MarkerManager(reactContext));
    }


    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (MarkerManager.REACT_CLASS.equals(name)) {
            return new MarkerManager(reactContext);
        }
        if (MapViewManager.REACT_CLASS.equals(name)) {
            return new MapViewManager(reactContext);
        }
        if (NativeAirMapsModuleSpec.NAME.equals(name)) {
            return new NativeAirMapsModule(reactContext);
        } else {
            return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @NonNull
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                Map<String, ReactModuleInfo> map = new HashMap<>();
                map.put(NativeAirMapsModuleSpec.NAME, new ReactModuleInfo(
                        NativeAirMapsModuleSpec.NAME,       // name
                        NativeAirMapsModuleSpec.NAME,       // className
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        false, // isCXXModule
                        true   // isTurboModule
                ));
                return map;
            }
        };
    }
}