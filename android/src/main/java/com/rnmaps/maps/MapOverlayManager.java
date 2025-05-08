package com.rnmaps.maps;

import android.content.Context;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

import java.util.Map;

public class MapOverlayManager extends ViewGroupManager<MapOverlay> {

  public MapOverlayManager(ReactApplicationContext reactContext) {
    super();
    DisplayMetrics metrics = new DisplayMetrics();
    ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
        .getDefaultDisplay()
        .getRealMetrics(metrics);
  }

  @Override
  public String getName() {
    return "AIRMapOverlay";
  }

  @Override
  public MapOverlay createViewInstance(ThemedReactContext context) {
    return new MapOverlay(context);
  }

  @ReactProp(name = "bounds")
  public void setBounds(MapOverlay view, ReadableArray bounds) {
    view.setBounds(fixBoundsIfNecessary(bounds));
  }

  // seems like apple users north west, south east
  // google uses north east, south west
  private static LatLngBounds fixBoundsIfNecessary(ReadableArray bounds) {
    double lat1 = bounds.getArray(0).getDouble(0);
    double lon1 = bounds.getArray(0).getDouble(1);
    double lat2 = bounds.getArray(1).getDouble(0);
    double lon2 = bounds.getArray(1).getDouble(1);

// Ensure lat1/lon1 is the SW corner and lat2/lon2 is the NE corner
    double southLat = Math.min(lat1, lat2);
    double northLat = Math.max(lat1, lat2);
    double westLon = Math.min(lon1, lon2);
    double eastLon = Math.max(lon1, lon2);

// Create corrected LatLngs
    LatLng sw = new LatLng(southLat, westLon);
    LatLng ne = new LatLng(northLat, eastLon);
    return new LatLngBounds(sw, ne);
  }

  @ReactProp(name = "bearing")
  public void setBearing(MapOverlay view, float bearing){
    view.setBearing(bearing);
  }

  @ReactProp(name = "zIndex", defaultFloat = 1.0f)
  public void setZIndex(MapOverlay view, float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "opacity", defaultFloat = 1.0f)
  public void setOpacity(MapOverlay view, float opacity) {
    view.setTransparency(1 - opacity);
  }

  @ReactProp(name = "image")
  public void setImage(MapOverlay view, @Nullable String source) {
    view.setImage(source);
  }

  @ReactProp(name = "tappable", defaultBoolean = false)
  public void setTappable(MapOverlay view, boolean tapabble) {
    view.setTappable(tapabble);
  }

  @Override
  @Nullable
  public Map getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.of(
        "onPress", MapBuilder.of("registrationName", "onPress")
    );
  }
}
