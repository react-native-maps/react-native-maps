package com.rnmaps.maps;

import android.content.Context;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class MapUrlTileManager extends ViewGroupManager<MapUrlTile> {

  public MapUrlTileManager(ReactApplicationContext reactContext) {
    super();
  }

  @Override
  public String getName() {
    return "AIRMapUrlTile";
  }

  @Override
  public MapUrlTile createViewInstance(ThemedReactContext context) {
    return new MapUrlTile(context);
  }

  @ReactProp(name = "urlTemplate")
  public void setUrlTemplate(MapUrlTile view, String urlTemplate) {
    view.setUrlTemplate(urlTemplate);
  }

  @ReactProp(name = "zIndex", defaultFloat = -1.0f)
  public void setZIndex(MapUrlTile view, float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "minimumZ", defaultInt = 0)
  public void setMinimumZ(MapUrlTile view, int minimumZ) {
    view.setMinimumZ(minimumZ);
  }

  @ReactProp(name = "maximumZ", defaultInt = 100)
  public void setMaximumZ(MapUrlTile view, int maximumZ) {
    view.setMaximumZ(maximumZ);
  }

  @ReactProp(name = "maximumNativeZ", defaultInt = 100)
  public void setMaximumNativeZ(MapUrlTile view, int maximumNativeZ) {
    view.setMaximumNativeZ(maximumNativeZ);
  }

  @ReactProp(name = "flipY", defaultBoolean = false)
  public void setFlipY(MapUrlTile view, boolean flipY) {
    view.setFlipY(flipY);
  }

  @ReactProp(name = "tileSize", defaultInt = 256)
  public void setTileSize(MapUrlTile view, int tileSize) {
    view.setTileSize(tileSize);
  }

  @ReactProp(name = "doubleTileSize", defaultBoolean = false)
  public void setDoubleTileSize(MapUrlTile view, boolean doubleTileSize) {
    view.setDoubleTileSize(doubleTileSize);
  }

  @ReactProp(name = "tileCachePath")
  public void setTileCachePath(MapUrlTile view, String tileCachePath) {
    view.setTileCachePath(tileCachePath);
  }

  @ReactProp(name = "tileCacheMaxAge", defaultInt = 0)
  public void setTileCacheMaxAge(MapUrlTile view, int tileCacheMaxAge) {
    view.setTileCacheMaxAge(tileCacheMaxAge);
  }

  @ReactProp(name = "offlineMode", defaultBoolean = false)
  public void setOfflineMode(MapUrlTile view, boolean offlineMode) {
    view.setOfflineMode(offlineMode);
  }

  @ReactProp(name = "opacity", defaultFloat = 1.0f)
  public void setOpacity(MapUrlTile view, float opacity) {
    view.setOpacity(opacity);
  }
}
