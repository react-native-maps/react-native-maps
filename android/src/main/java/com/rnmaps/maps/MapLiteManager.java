package com.rnmaps.maps;

import com.facebook.react.bridge.ReactApplicationContext;
import com.google.android.gms.maps.GoogleMapOptions;

public class MapLiteManager extends MapManager {

  private static final String REACT_CLASS = "AIRMapLite";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  public MapLiteManager(ReactApplicationContext context) {
    super(context);
    this.googleMapOptions = new GoogleMapOptions().liteMode(true);
  }

}
