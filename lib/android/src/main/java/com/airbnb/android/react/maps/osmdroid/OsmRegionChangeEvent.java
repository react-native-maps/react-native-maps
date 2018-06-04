package com.airbnb.android.react.maps.osmdroid;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

import org.osmdroid.api.IGeoPoint;
import org.osmdroid.util.BoundingBox;

public class OsmRegionChangeEvent extends Event<com.airbnb.android.react.maps.RegionChangeEvent> {
  private final BoundingBox bounds;
  private final IGeoPoint center;
  private final boolean continuous;

  public OsmRegionChangeEvent(int id, BoundingBox bounds, IGeoPoint center, boolean continuous) {
    super(id);
    this.bounds = bounds;
    this.center = center;
    this.continuous = continuous;
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

    WritableMap region = new WritableNativeMap();
    region.putDouble("latitude", center.getLatitude());
    region.putDouble("longitude", center.getLongitude());
    region.putDouble("latitudeDelta", bounds.getLatitudeSpan());
    region.putDouble("longitudeDelta", bounds.getLongitudeSpan());
    event.putMap("region", region);

    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), event);
  }
}