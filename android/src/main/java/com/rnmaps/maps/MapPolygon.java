package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Color;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.google.android.gms.maps.model.Dash;
import com.google.android.gms.maps.model.Gap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.PatternItem;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;
import com.google.maps.android.collections.PolygonManager;
import com.rnmaps.fabric.event.OnPressEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MapPolygon extends MapFeature {

  private PolygonOptions polygonOptions;
  private Polygon polygon;

  private List<LatLng> coordinates;
  private List<List<LatLng>> holes;
  private int strokeColor;
  private int fillColor;
  private float strokeWidth;
  private boolean geodesic;
  private boolean tappable;
  private float zIndex;
  private ReadableArray patternValues;
  private List<PatternItem> pattern;

  public MapPolygon(Context context) {
    super(context);
    strokeWidth = 10;
  }

    public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
      MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
      builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
      return builder.build();
    }

  public  <T extends Event> void dispatchEvent(WritableMap payload, MapView.EventCreator<T> creator, ReactContext reactContext) {

    // Get the event dispatcher
    EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());

    // If there is a dispatcher, create and dispatch the event
    if (eventDispatcher != null) {
      int surfaceId = UIManagerHelper.getSurfaceId(reactContext);
      T event = creator.create(surfaceId, getId(), payload);
      eventDispatcher.dispatchEvent(event);
    }
  }


  public void setCoordinates(ReadableArray coordinates) {
    // it's kind of a bummer that we can't run map() or anything on the ReadableArray
    this.coordinates = new ArrayList<>(coordinates.size());
    for (int i = 0; i < coordinates.size(); i++) {
      ReadableMap coordinate = coordinates.getMap(i);
      this.coordinates.add(i,
          new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }
    if (polygon != null) {
      polygon.setPoints(this.coordinates);
    }
  }

  public void setHoles(ReadableArray holes) {
    if (holes == null) { return; }

    this.holes = new ArrayList<>(holes.size());

    for (int i = 0; i < holes.size(); i++) {
      ReadableArray hole = holes.getArray(i);

      if (hole.size() < 3) { continue; }

      List<LatLng> coordinates = new ArrayList<>();
      for (int j = 0; j < hole.size(); j++) {
        ReadableMap coordinate = hole.getMap(j);
        coordinates.add(new LatLng(
            coordinate.getDouble("latitude"),
            coordinate.getDouble("longitude")));
      }

      // If hole is triangle
      if (coordinates.size() == 3) {
        coordinates.add(coordinates.get(0));
      }

      this.holes.add(coordinates);
    }

    if (polygon != null) {
      polygon.setHoles(this.holes);
    }
  }


  public void setFillColor(int color) {
    this.fillColor = color;
    if (polygon != null) {
      polygon.setFillColor(color);
    }
  }

  public void setStrokeColor(int color) {
    this.strokeColor = color;
    if (polygon != null) {
      polygon.setStrokeColor(color);
    }
  }

  public void setStrokeWidth(float width) {
    this.strokeWidth = width;
    if (polygon != null) {
      polygon.setStrokeWidth(width);
    }
  }

  public void setTappable(boolean tapabble) {
    this.tappable = tapabble;
    if (polygon != null) {
      polygon.setClickable(tappable);
    }
  }

  public void setGeodesic(boolean geodesic) {
    this.geodesic = geodesic;
    if (polygon != null) {
      polygon.setGeodesic(geodesic);
    }
  }

  public void setZIndex(float zIndex) {
    this.zIndex = zIndex;
    if (polygon != null) {
      polygon.setZIndex(zIndex);
    }
  }

  public void setLineDashPattern(ReadableArray patternValues) {
    this.patternValues = patternValues;
    this.applyPattern();
  }

  private void applyPattern() {
    if(patternValues == null) {
      return;
    }
    this.pattern = new ArrayList<>(patternValues.size());
    for (int i = 0; i < patternValues.size(); i++) {
      float patternValue = (float) patternValues.getDouble(i);
      boolean isGap = i % 2 != 0;
      if(isGap) {
        this.pattern.add(new Gap(patternValue));
      }else {
        PatternItem patternItem;
        patternItem = new Dash(patternValue);
        this.pattern.add(patternItem);
      }
    }
    if(polygon != null) {
      polygon.setStrokePattern(this.pattern);
    }
  }

  public PolygonOptions getPolygonOptions() {
    if (polygonOptions == null) {
      polygonOptions = createPolygonOptions();
    }
    return polygonOptions;
  }

  private PolygonOptions createPolygonOptions() {
    PolygonOptions options = new PolygonOptions();
    options.addAll(coordinates);
    options.fillColor(fillColor);
    options.strokeColor(strokeColor);
    options.strokeWidth(strokeWidth);
    options.geodesic(geodesic);
    options.zIndex(zIndex);
    options.strokePattern(this.pattern);
    options.clickable(this.tappable);

    if (this.holes != null) {
      for (int i = 0; i < holes.size(); i++) {
        options.addHole(holes.get(i));
      }
    }

    return options;
  }

  @Override
  public Object getFeature() {
    return polygon;
  }

  @Override
  public void addToMap(Object collection) {
    PolygonManager.Collection polygonCollection = (PolygonManager.Collection) collection;
    polygon = polygonCollection.addPolygon(getPolygonOptions());
  }

  @Override
  public void removeFromMap(Object collection) {
    PolygonManager.Collection polygonCollection = (PolygonManager.Collection) collection;
    polygonCollection.remove(polygon);
  }
}
