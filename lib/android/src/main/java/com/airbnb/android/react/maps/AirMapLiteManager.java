package com.airbnb.android.react.maps;

import com.google.android.gms.maps.GoogleMapOptions;

public class AirMapLiteManager extends AirMapManager {
  private static final String REACT_CLASS = "AIRMapLite";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  public AirMapLiteManager() {
    this.googleMapOptions = new GoogleMapOptions().liteMode(true);
  }
}
