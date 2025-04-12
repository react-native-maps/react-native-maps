package com.rnmaps.maps;

import android.content.Context;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class MapWMSTileManager extends ViewGroupManager<MapWMSTile> {

  public MapWMSTileManager(ReactApplicationContext reactContext) {
    super();
    DisplayMetrics metrics = new DisplayMetrics();
    ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
        .getDefaultDisplay()
        .getRealMetrics(metrics);
  }

  @Override
  public String getName() {
    return "AIRMapWMSTile";
  }

  @Override
  public MapWMSTile createViewInstance(ThemedReactContext context) {
    return new MapWMSTile(context);
  }

  @ReactProp(name = "urlTemplate")
  public void setUrlTemplate(MapWMSTile view, String urlTemplate) {
    view.setUrlTemplate(urlTemplate);
  }

  @ReactProp(name = "zIndex", defaultFloat = -1.0f)
  public void setZIndex(MapWMSTile view, float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "minimumZ", defaultInt = 0)
  public void setMinimumZ(MapWMSTile view, int minimumZ) {
    view.setMinimumZ(minimumZ);
  }

  @ReactProp(name = "maximumZ", defaultInt = 100)
  public void setMaximumZ(MapWMSTile view, int maximumZ) {
    view.setMaximumZ(maximumZ);
  }

  @ReactProp(name = "maximumNativeZ", defaultInt= 100)
  public void setMaximumNativeZ(MapWMSTile view, int maximumNativeZ) {
    view.setMaximumNativeZ(maximumNativeZ);
  }

  @ReactProp(name = "tileSize", defaultInt = 256)
  public void setTileSize(MapWMSTile view, int tileSize) {
    view.setTileSize(tileSize);
  }

  @ReactProp(name = "tileCachePath")
  public void setTileCachePath(MapWMSTile view, String tileCachePath) {
    view.setTileCachePath(tileCachePath);
  }

  @ReactProp(name = "tileCacheMaxAge", defaultInt = 0)
  public void setTileCacheMaxAge(MapWMSTile view, int tileCacheMaxAge) {
    view.setTileCacheMaxAge(tileCacheMaxAge);
  }

  @ReactProp(name = "offlineMode", defaultBoolean = false)
  public void setOfflineMode(MapWMSTile view, boolean offlineMode) {
    view.setOfflineMode(offlineMode);
  }

  @ReactProp(name = "opacity", defaultFloat = 1.0f)
  public void setOpacity(MapWMSTile view, float opacity) {
    view.setOpacity(opacity);
  }
}
