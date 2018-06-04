package com.airbnb.android.react.maps.osmdroid;

import android.content.Context;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Polyline;

import java.util.ArrayList;
import java.util.List;

public class OsmMapPolyline extends OsmMapFeature {

  private Polyline polyline;

  private List<GeoPoint> coordinates;
  private int color;
  private float width;
  private boolean geodesic;
//  private float zIndex;
  private MapView mapView;

  public OsmMapPolyline(Context context) {
    super(context);
  }

  public void setCoordinates(ReadableArray coordinates) {
    this.coordinates = new ArrayList<>(coordinates.size());
    for (int i = 0; i < coordinates.size(); i++) {
      ReadableMap coordinate = coordinates.getMap(i);
      this.coordinates.add(i,
          new GeoPoint(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }
    if (polyline != null) {
      polyline.setPoints(this.coordinates);
      mapView.invalidate();
    }
  }

  public void setColor(int color) {
    this.color = color;
    if (polyline != null) {
      polyline.setColor(color);
      mapView.invalidate();
    }
  }

  public void setWidth(float width) {
    this.width = width;
    if (polyline != null) {
      polyline.setWidth(width);
      mapView.invalidate();
    }
  }

//  public void setZIndex(float zIndex) {
//    this.zIndex = zIndex;
//    if (polyline != null) {
//      polyline.setZIndex(zIndex);
//    }
//  }
//
  public void setGeodesic(boolean geodesic) {
    this.geodesic = geodesic;
    if (polyline != null) {
      polyline.setGeodesic(geodesic);
      mapView.invalidate();
    }
  }

  @Override
  public Object getFeature() {
    return polyline;
  }

  @Override
  public void addToMap(MapView map) {
    polyline = new Polyline();
    mapView = map;
    polyline.setPoints(coordinates);
    polyline.setColor(color);
    polyline.setWidth(width);
    polyline.setGeodesic(geodesic);
    mapView.getOverlayManager().add(polyline);
    mapView.invalidate();
  }

  @Override
  public void removeFromMap(MapView map) {
    map.getOverlays().remove(polyline);
    polyline = null;
    mapView = null;
  }
}
