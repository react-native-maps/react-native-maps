package com.rnmaps.maps;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.maps.GoogleMap;

public abstract class MapFeature extends ReactViewGroup {
  public MapFeature(Context context) {
    super(context);
  }

  public abstract void addToMap(GoogleMap map);

  public abstract void removeFromMap(GoogleMap map);

  public abstract Object getFeature();
}
