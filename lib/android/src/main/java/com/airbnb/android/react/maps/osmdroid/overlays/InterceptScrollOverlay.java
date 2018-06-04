package com.airbnb.android.react.maps.osmdroid.overlays;

import android.graphics.Canvas;
import android.view.MotionEvent;

import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Overlay;

public class InterceptScrollOverlay extends Overlay {

  public InterceptScrollOverlay() {
  }

  @Override public void draw(Canvas canvas, MapView mapView, boolean b) {
  }

  @Override public boolean onScroll(MotionEvent pEvent1, MotionEvent pEvent2, float pDistanceX,
      float pDistanceY, MapView pMapView) {
    return isEnabled();
  }
}