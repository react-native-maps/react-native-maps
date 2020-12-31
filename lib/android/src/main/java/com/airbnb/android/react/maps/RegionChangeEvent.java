package com.airbnb.android.react.maps;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.VisibleRegion;

public class RegionChangeEvent extends Event<RegionChangeEvent> {
  private final VisibleRegion visibleRegion;
  private final boolean continuous;
  private final boolean isGesture;

  public RegionChangeEvent(int id, VisibleRegion visibleRegion, boolean continuous, boolean isGesture) {
    super(id);
    this.visibleRegion = visibleRegion;
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

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    WritableMap event = new WritableNativeMap();
    event.putBoolean("continuous", continuous);
    LatLngBounds bounds = visibleRegion.latLngBounds;
    WritableMap region = new WritableNativeMap();
    LatLng center = bounds.getCenter();
    region.putDouble("latitude", center.latitude);
    region.putDouble("longitude", center.longitude);
    region.putDouble("latitudeDelta", bounds.northeast.latitude - bounds.southwest.latitude);
    region.putDouble("longitudeDelta", bounds.northeast.longitude - bounds.southwest.longitude);
    region.putDouble("farRightLatitude", visibleRegion.farRight.latitude);
    region.putDouble("farRightLongitude", visibleRegion.farRight.longitude);
    region.putDouble("farLeftLatitude", visibleRegion.farLeft.latitude);
    region.putDouble("farLeftLongitude", visibleRegion.farLeft.longitude);
    region.putDouble("nearRightLatitude", visibleRegion.nearRight.latitude);
    region.putDouble("nearRightLongitude", visibleRegion.nearRight.longitude);
    region.putDouble("nearLeftLatitude", visibleRegion.nearLeft.latitude);
    region.putDouble("nearLeftLongitude", visibleRegion.nearLeft.longitude);
    event.putMap("region", region);
    event.putBoolean("isGesture", isGesture);

    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
  }
}
