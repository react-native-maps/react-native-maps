package com.airbnb.android.react.maps.osmdroid.overlays;

import android.graphics.Canvas;
import android.view.MotionEvent;

import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Overlay;

public class InterceptDoubleTapOverlay extends Overlay {

  public InterceptDoubleTapOverlay() {
  }

  @Override public void draw(Canvas canvas, MapView mapView, boolean b) {
  }

  @Override
  public boolean onDoubleTap(MotionEvent e, MapView mapView) {
    return isEnabled();
  }
}