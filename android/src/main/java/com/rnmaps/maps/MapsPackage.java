package com.rnmaps.maps;

import androidx.annotation.NonNull;

import com.facebook.fbreact.specs.NativeAirMapsModuleSpec;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.rnmaps.fabric.CalloutManager;
import com.rnmaps.fabric.CircleManager;
import com.rnmaps.fabric.MapViewManager;
import com.rnmaps.fabric.MarkerManager;
import com.rnmaps.fabric.NativeAirMapsModule;
import com.rnmaps.fabric.OverlayManager;
import com.rnmaps.fabric.PolygonManager;
import com.rnmaps.fabric.PolylineManager;
import com.rnmaps.fabric.UrlTileManager;
import com.rnmaps.fabric.WMSTileManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapsPackage extends BaseReactPackage implements ReactPackage {

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return List.of(new MapViewManager(reactContext),
            new MarkerManager(reactContext),
            new CalloutManager(reactContext),
            new PolygonManager(reactContext),
            new PolylineManager(reactContext),
            new CircleManager(reactContext),
            new OverlayManager(reactContext),
            new UrlTileManager(reactContext),
            new WMSTileManager(reactContext),
            new MapGradientPolylineManager(reactContext),
            new MapLocalTileManager(reactContext),
            new MapHeatmapManager());
  }


  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (OverlayManager.REACT_CLASS.equals(name)) {
      return new OverlayManager(reactContext);
    }
    if (CircleManager.REACT_CLASS.equals(name)) {
      return new CircleManager(reactContext);
    }
    if (PolylineManager.REACT_CLASS.equals(name)) {
      return new PolylineManager(reactContext);
    }
    if (PolygonManager.REACT_CLASS.equals(name)) {
      return new PolygonManager(reactContext);
    }
    if (CalloutManager.REACT_CLASS.equals(name)) {
      return new CalloutManager(reactContext);
    }
    if (MarkerManager.REACT_CLASS.equals(name)) {
      return new MarkerManager(reactContext);
    }
    if (MapViewManager.REACT_CLASS.equals(name)) {
      return new MapViewManager(reactContext);
    }
    if (UrlTileManager.REACT_CLASS.equals(name)) {
      return new UrlTileManager(reactContext);
    }
    if (WMSTileManager.REACT_CLASS.equals(name)) {
      return new WMSTileManager(reactContext);
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
