package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Color;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.gms.maps.model.ButtCap;
import com.google.android.gms.maps.model.Cap;
import com.google.android.gms.maps.model.RoundCap;
import com.google.android.gms.maps.model.SquareCap;

import java.util.Map;

public class MapPolylineManager extends ViewGroupManager<MapPolyline> {
  private final DisplayMetrics metrics;

  public MapPolylineManager(ReactApplicationContext reactContext) {
    super();
    metrics = new DisplayMetrics();
    ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
        .getDefaultDisplay()
        .getRealMetrics(metrics);
  }

  @Override
  public String getName() {
    return "AIRMapPolyline";
  }

  @Override
  public MapPolyline createViewInstance(ThemedReactContext context) {
    return new MapPolyline(context);
  }

  @ReactProp(name = "coordinates")
  public void setCoordinate(MapPolyline view, ReadableArray coordinates) {
    view.setCoordinates(coordinates);
  }

  @ReactProp(name = "strokeWidth", defaultFloat = 1f)
  public void setStrokeWidth(MapPolyline view, float widthInPoints) {
    float widthInScreenPx = metrics.density * widthInPoints; // done for parity with iOS
    view.setWidth(widthInScreenPx);
  }

  @ReactProp(name = "strokeColor", defaultInt = Color.RED, customType = "Color")
  public void setStrokeColor(MapPolyline view, int color) {
    view.setColor(color);
  }

  @ReactProp(name = "tappable", defaultBoolean = false)
  public void setTappable(MapPolyline view, boolean tapabble) {
    view.setTappable(tapabble);
  }

  @ReactProp(name = "geodesic", defaultBoolean = false)
  public void setGeodesic(MapPolyline view, boolean geodesic) {
    view.setGeodesic(geodesic);
  }

  @ReactProp(name = "zIndex", defaultFloat = 1.0f)
  public void setZIndex(MapPolyline view, float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "lineCap")
  public void setlineCap(MapPolyline view, String lineCap) {
      view.setLineCap(lineCap);
  }

  @ReactProp(name = "lineDashPattern")
  public void setLineDashPattern(MapPolyline view, ReadableArray patternValues) {
      view.setLineDashPattern(patternValues);
  }

  @Override
  @Nullable
  public Map getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.of(
        "onPress", MapBuilder.of("registrationName", "onPress")
    );
  }
}
