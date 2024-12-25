package com.rnmaps.maps;

import androidx.annotation.NonNull;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.rnmaps.fabric.NativeAirMapsModule;
import com.rnmaps.fabric.NativeAirMapsModuleSpec;

import java.util.HashMap;
import java.util.Map;

public class MapAirModulePackage extends TurboReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals(NativeAirMapsModuleSpec.NAME)) {
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