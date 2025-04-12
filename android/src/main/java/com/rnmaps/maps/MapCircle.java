package com.rnmaps.maps;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.collections.CircleManager;
import com.rnmaps.fabric.event.OnPressEvent;

import java.util.Map;

public class MapCircle extends MapFeature {

  private CircleOptions circleOptions;
  private Circle circle;

  private LatLng center;
  private double radius;
  private int strokeColor;
  private int fillColor;
  private float strokeWidth;
  private float zIndex;
  private boolean tappable;

  public MapCircle(Context context) {
    super(context);
  }

  public void setCenter(LatLng center) {
    this.center = center;
    if (circle != null) {
      circle.setCenter(this.center);
    }
  }

  public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
    return builder.build();
  }

  public void setRadius(double radius) {
    this.radius = radius;
    if (circle != null) {
      circle.setRadius(this.radius);
    }
  }

  public void setFillColor(int color) {
    this.fillColor = color;
    if (circle != null) {
      circle.setFillColor(color);
    }
  }

  public void setStrokeColor(int color) {
    this.strokeColor = color;
    if (circle != null) {
      circle.setStrokeColor(color);
    }
  }

  public void setStrokeWidth(float width) {
    this.strokeWidth = width;
    if (circle != null) {
      circle.setStrokeWidth(width);
    }
  }

  public void setZIndex(float zIndex) {
    this.zIndex = zIndex;
    if (circle != null) {
      circle.setZIndex(zIndex);
    }
  }

  public void setTappable(boolean tappable) {
    this.tappable = tappable;
    if (circle != null) {
      circle.setClickable(tappable);
    }
  }

  public CircleOptions getCircleOptions() {
    if (circleOptions == null) {
      circleOptions = createCircleOptions();
    }
    return circleOptions;
  }

  private CircleOptions createCircleOptions() {
    CircleOptions options = new CircleOptions();
    options.center(center);
    options.radius(radius);
    options.fillColor(fillColor);
    options.strokeColor(strokeColor);
    options.strokeWidth(strokeWidth);
    options.zIndex(zIndex);
    return options;
  }

  @Override
  public Object getFeature() {
    return circle;
  }

  @Override
  public void addToMap(Object collection) {
    CircleManager.Collection circleCollection = (CircleManager.Collection) collection;
    circle = circleCollection.addCircle(getCircleOptions());
  }

  @Override
  public void removeFromMap(Object collection) {
    CircleManager.Collection circleCollection = (CircleManager.Collection) collection;
    circleCollection.remove(circle);
  }


  public void setCenter(ReadableMap center) {
    setCenter(new LatLng(center.getDouble("latitude"), center.getDouble("longitude")));
  }
}
