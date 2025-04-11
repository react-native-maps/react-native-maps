package com.rnmaps.maps;

import android.content.Context;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.views.view.ReactViewGroup;
import com.rnmaps.fabric.event.OnPressEvent;

import java.util.Map;

public class MapCallout extends ReactViewGroup {
  private boolean tooltip = false;
  public int width;
  public int height;

  public MapCallout(Context context) {
    super(context);
  }

  public void setTooltip(boolean tooltip) {
    this.tooltip = tooltip;
  }

  public boolean getTooltip() {
    return this.tooltip;
  }

  @Override
  protected void onLayout(boolean changed,
                                   int left, int top, int right, int bottom){
    width = right - left;
    height = bottom - top;
  }


  public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
   builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
   return builder.build();
  }
}
