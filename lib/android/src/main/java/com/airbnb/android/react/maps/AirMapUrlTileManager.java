package com.airbnb.android.react.maps;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class AirMapUrlTileManager extends ViewGroupManager<AirMapUrlTile> {
  @Override public String getName() {
    return "AIRMapUrlTile";
  }

  @Override public AirMapUrlTile createViewInstance(ThemedReactContext context) {
    return new AirMapUrlTile(context);
  }

  @ReactProp(name = "urlTemplate")
  public void setUrlTemplate(AirMapUrlTile view, String urlTemplate) {
    view.setUrlTemplate(urlTemplate);
  }

  @ReactProp(name = "zIndex", defaultFloat = -1.0f)
  public void setZIndex(AirMapUrlTile view, float zIndex) {
    view.setZIndex(zIndex);
  }
}
