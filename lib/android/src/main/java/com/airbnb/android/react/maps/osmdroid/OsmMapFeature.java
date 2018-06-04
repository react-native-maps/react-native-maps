package com.airbnb.android.react.maps.osmdroid;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;

import org.osmdroid.views.MapView;

public abstract class OsmMapFeature extends ReactViewGroup {
  public OsmMapFeature(Context context) {
    super(context);
  }

  public abstract void addToMap(MapView map);

  public abstract void removeFromMap(MapView map);

  public abstract Object getFeature();
}
