package com.rnmaps.maps;

import android.content.Context;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.views.view.ReactViewGroup;
import com.rnmaps.fabric.event.OnLongPressEvent;
import com.rnmaps.fabric.event.OnMarkerDeselectEvent;
import com.rnmaps.fabric.event.OnMarkerDragEndEvent;
import com.rnmaps.fabric.event.OnMarkerDragEvent;
import com.rnmaps.fabric.event.OnMarkerDragStartEvent;
import com.rnmaps.fabric.event.OnMarkerPressEvent;
import com.rnmaps.fabric.event.OnMarkerSelectEvent;
import com.rnmaps.fabric.event.OnPoiClickEvent;
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


  public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
   builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
   return builder.build();
  }
}
