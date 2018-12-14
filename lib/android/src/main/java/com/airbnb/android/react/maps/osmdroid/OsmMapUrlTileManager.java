package com.airbnb.android.react.maps.osmdroid;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class OsmMapUrlTileManager extends ViewGroupManager<OsmMapUrlTile> {

  public OsmMapUrlTileManager() {
    super();
  }

  @Override
  public String getName() {
    return "OsmMapUrlTile";
  }

  @Override
  public OsmMapUrlTile createViewInstance(ThemedReactContext context) {
    return new OsmMapUrlTile(context);
  }

  @ReactProp(name = "urlTemplate")
  public void setUrlTemplate(OsmMapUrlTile view, String urlTemplate) {
    view.setUrlTemplate(urlTemplate);
  }

  @ReactProp(name = "minimumZ", defaultFloat = 0.0f)
  public void setMinimumZ(OsmMapUrlTile view, float minimumZ) {
    view.setMinimumZ(minimumZ);
  }

  @ReactProp(name = "maximumZ", defaultFloat = 100.0f)
  public void setMaximumZ(OsmMapUrlTile view, float maximumZ) {
    view.setMaximumZ(maximumZ);
  }

}
