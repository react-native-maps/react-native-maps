package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.GroundOverlay;
import com.google.android.gms.maps.model.GroundOverlayOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

import java.util.ArrayList;

public class AirMapOverlay extends AirMapFeature {

  private GroundOverlayOptions groundOverlayOptions;
  private GroundOverlay groundOverlay;
  private LatLngBounds bounds;
  private BitmapDescriptor iconBitmapDescriptor;
  private float zIndex;
  private float transparency;


  public AirMapOverlay(Context context) {
    super(context);
  }


  public void setBounds(ReadableArray bounds) {
    ArrayList<ReadableArray> tmpBounds = new ArrayList<>(bounds.size());
    for (int i = 0; i < bounds.size(); i++) {
      tmpBounds.add(bounds.getArray(i));
    }
    this.bounds =  new LatLngBounds(
        new LatLng(Double.parseDouble(bounds.getArray(0).getString(0)), Double.parseDouble(bounds.getArray(0)
            .getString(1))),
        new LatLng(Double.parseDouble(bounds.getArray(1).getString(0)), Double
            .parseDouble(bounds.getArray(1)
                .getString(1)))
    );
    if (groundOverlay != null) {
      groundOverlay.setPositionFromBounds(this.bounds);
    }
  }

  public void setZIndex(float zIndex) {
    this.zIndex = zIndex;
    if (groundOverlay != null) {
      groundOverlay.setZIndex(zIndex);
    }
  }

  // public void setTransparency(float transparency) {
  //     this.transparency = transparency;
  //     if (groundOverlay != null) {
  //         groundOverlay.setTransparency(transparency);
  //     }
  // }

  public void setImage(String uri) {
    this.iconBitmapDescriptor = getBitmapDescriptorByName(uri);

    if (groundOverlay != null) {
      groundOverlay.setImage(this.iconBitmapDescriptor);
    }
  }


  public GroundOverlayOptions getGroundOverlayOptions() {
    if (groundOverlayOptions == null) {
      groundOverlayOptions = createGroundOverlayOptions();
    }
    return groundOverlayOptions;
  }

  private GroundOverlayOptions createGroundOverlayOptions() {
    GroundOverlayOptions options = new GroundOverlayOptions();
    options.image(iconBitmapDescriptor);
    options.positionFromBounds(bounds);
    // options.transparency(transparency);
    options.zIndex(zIndex);
    return options;
  }

  private BitmapDescriptor getBitmapDescriptorByName(String name) {
    Bitmap bitmap = ImageUtil.convert(name);
    return BitmapDescriptorFactory.fromBitmap(bitmap);
  }

  @Override
  public Object getFeature() {
    return groundOverlay;
  }

  @Override
  public void addToMap(GoogleMap map) {
    groundOverlay = map.addGroundOverlay(getGroundOverlayOptions());
    groundOverlay.setClickable(true);
  }

  @Override
  public void removeFromMap(GoogleMap map) {
    groundOverlay.remove();
  }
}
