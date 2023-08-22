package com.rnmaps.maps;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.uimanager.events.Event;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

public class RegionChangeEvent extends Event<RegionChangeEvent> {
  private final LatLngBounds bounds;
  private final boolean continuous;
  private final boolean isGesture;

  public RegionChangeEvent(int surfaceId, int id, LatLngBounds bounds, boolean continuous, boolean isGesture) {
    super(surfaceId, id);
    this.bounds = bounds;
    this.continuous = continuous;
    this.isGesture = isGesture;
  }

  @Override
  public String getEventName() {
    return "topChange";
  }

  @Override
  public boolean canCoalesce() {
    return false;
  }

  @Nullable
  @Override
  protected WritableMap getEventData() {
    WritableMap eventData = Arguments.createMap(); //new WritableNativeMap();
    eventData.putBoolean("continuous", continuous);

    WritableMap region = Arguments.createMap();
    LatLng center = bounds.getCenter();
    region.putDouble("latitude", center.latitude);
    region.putDouble("longitude", center.longitude);
    region.putDouble("latitudeDelta", bounds.northeast.latitude - bounds.southwest.latitude);
    region.putDouble("longitudeDelta", bounds.northeast.longitude - bounds.southwest.longitude);
    eventData.putMap("region", region);
    eventData.putBoolean("isGesture", isGesture);

    return eventData;
  }
}
