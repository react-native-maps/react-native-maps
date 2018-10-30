package com.airbnb.android.react.maps;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class AirMapGSUrlTileManager extends ViewGroupManager<AirMapGSUrlTile> {
  private DisplayMetrics metrics;

  public AirMapGSUrlTileManager(ReactApplicationContext reactContext) {
    super();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      metrics = new DisplayMetrics();
      ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
          .getDefaultDisplay()
          .getRealMetrics(metrics);
    } else {
      metrics = reactContext.getResources().getDisplayMetrics();
    }
  }

  @Override
  public String getName() {
    return "AIRMapGSUrlTile";
  }

  @Override
  public AirMapGSUrlTile createViewInstance(ThemedReactContext context) {
    return new AirMapGSUrlTile(context);
  }

  @ReactProp(name = "urlTemplate")
  public void setUrlTemplate(AirMapGSUrlTile view, String urlTemplate) {
    view.setUrlTemplate(urlTemplate);
  }

  @ReactProp(name = "zIndex", defaultFloat = -1.0f)
  public void setZIndex(AirMapGSUrlTile view, float zIndex) {
    view.setZIndex(zIndex);
  }

  @ReactProp(name = "minimumZ", defaultFloat = 0.0f)
  public void setMinimumZ(AirMapGSUrlTile view, float minimumZ) {
    view.setMinimumZ(minimumZ);
  }

  @ReactProp(name = "maximumZ", defaultFloat = 100.0f)
  public void setMaximumZ(AirMapGSUrlTile view, float maximumZ) {
    view.setMaximumZ(maximumZ);
  }

  @ReactProp(name = "tileSize", defaultInt = 512)
  public void setTileSize(AirMapGSUrlTile view, int tileSize) {
    view.setTileSize(tileSize);
  }
  @ReactProp(name = "opacity", defaultFloat = 1.0f)
  public void setOpacity(AirMapGSUrlTile view, float opacity) {
    view.setOpacity(opacity);
  }
}
