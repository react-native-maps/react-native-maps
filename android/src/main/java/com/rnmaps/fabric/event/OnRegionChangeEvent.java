package com.rnmaps.fabric.event;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.events.Event;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

public class OnRegionChangeEvent extends Event<OnRegionChangeEvent> {
  public static final String EVENT_NAME = "topRegionChange";

  private final WritableMap payload;

  public OnRegionChangeEvent(int surfaceId, int viewId, WritableMap payload) {
    super(surfaceId, viewId);
    this.payload = payload;
  }
  public static WritableMap payLoadFor(LatLngBounds bounds, boolean isGesture) {

    WritableMap event = new WritableNativeMap();
    WritableMap region = new WritableNativeMap();
    LatLng center = bounds.getCenter();
    region.putDouble("latitude", center.latitude);
    region.putDouble("longitude", center.longitude);
    region.putDouble("latitudeDelta", bounds.northeast.latitude - bounds.southwest.latitude);
    region.putDouble("longitudeDelta", bounds.northeast.longitude - bounds.southwest.longitude);
    event.putMap("region", region);
    event.putBoolean("isGesture", isGesture);
    return event;
  }

  @NonNull
  @Override
  public String getEventName() {
    return EVENT_NAME;
  }


  @Override
  protected WritableMap getEventData() {
    return payload;
  }

}
