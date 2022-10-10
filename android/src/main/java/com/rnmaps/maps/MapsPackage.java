package com.rnmaps.maps;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MapsPackage implements ReactPackage {
  public MapsPackage(Activity activity) {
  } // backwards compatibility

  public MapsPackage() {
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(new MapModule(reactContext));
  }

  // Deprecated RN 0.47
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    MapCalloutManager calloutManager = new MapCalloutManager();
    MapMarkerManager annotationManager = new MapMarkerManager();
    MapPolylineManager polylineManager = new MapPolylineManager(reactContext);
    MapGradientPolylineManager gradientPolylineManager = new MapGradientPolylineManager(reactContext);
    MapPolygonManager polygonManager = new MapPolygonManager(reactContext);
    MapCircleManager circleManager = new MapCircleManager(reactContext);
    MapManager mapManager = new MapManager(reactContext);
    MapLiteManager mapLiteManager = new MapLiteManager(reactContext);
    MapUrlTileManager urlTileManager = new MapUrlTileManager(reactContext);
    MapWMSTileManager gsUrlTileManager = new MapWMSTileManager(reactContext);
    MapLocalTileManager localTileManager = new MapLocalTileManager(reactContext);
    MapOverlayManager overlayManager = new MapOverlayManager(reactContext);
    MapHeatmapManager heatmapManager = new MapHeatmapManager();
    mapManager.setMarkerManager(annotationManager);

    return Arrays.<ViewManager>asList(
        calloutManager,
        annotationManager,
        polylineManager,
        gradientPolylineManager,
        polygonManager,
        circleManager,
        mapManager,
        mapLiteManager,
        urlTileManager,
        gsUrlTileManager,
        localTileManager,
        overlayManager,
        heatmapManager
    );
  }
}
