package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.GroundOverlay;
import com.google.android.gms.maps.model.GroundOverlayOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

public class AirMapOverlay extends AirMapFeature implements ISupportImageReader {

  private GroundOverlayOptions groundOverlayOptions;
  private GroundOverlay groundOverlay;
  private LatLngBounds bounds;
  private Bitmap iconBitmap;
  private BitmapDescriptor iconBitmapDescriptor;
  private float zIndex;
  private float transparency;

  private final ImageReader mImageReader;
  private GoogleMap map;

  public AirMapOverlay(Context context) {
    super(context);
    mImageReader = new ImageReader(context, getResources(), this);
  }

  public void setBounds(ReadableArray bounds) {
    LatLng sw = new LatLng(bounds.getArray(1).getDouble(0), bounds.getArray(0).getDouble(1));
    LatLng ne = new LatLng(bounds.getArray(0).getDouble(0), bounds.getArray(1).getDouble(1));
    this.bounds = new LatLngBounds(sw, ne);
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
    if (uri == null) {
      iconBitmapDescriptor = null;
      update();
    } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
        uri.startsWith("file://")) {
      mImageReader.setImage(uri);
    } else {
      iconBitmapDescriptor = getBitmapDescriptorByName(uri);
      if (iconBitmapDescriptor != null) {
        iconBitmap = BitmapFactory.decodeResource(getResources(), getDrawableResourceByName(uri));
      }
      update();
    }
  }

  // from AirMapMarker
  private int getDrawableResourceByName(String name) {
    return getResources().getIdentifier(
        name,
        "drawable",
        getContext().getPackageName());
  }


  public GroundOverlayOptions getGroundOverlayOptions() {
    if (groundOverlayOptions == null) {
      groundOverlayOptions = createGroundOverlayOptions();
    }
    return groundOverlayOptions;
  }

  private GroundOverlayOptions createGroundOverlayOptions() {
    if (iconBitmapDescriptor != null && bounds != null) {

      GroundOverlayOptions options = new GroundOverlayOptions();
      options.image(iconBitmapDescriptor);
      options.positionFromBounds(bounds);
      // options.transparency(transparency);
      //options.zIndex(zIndex);
      return options;
    } else {
      return null;
    }
  }

  // from AirMapMarker
  private BitmapDescriptor getBitmapDescriptorByName(String name) {
    return BitmapDescriptorFactory.fromResource(getDrawableResourceByName(name));
  }

  @Override
  public Object getFeature() {
    return groundOverlay;
  }

  @Override
  public void addToMap(GoogleMap map) {
    GroundOverlayOptions groundOverlayOptions = getGroundOverlayOptions();
    if (groundOverlayOptions != null) {
      groundOverlay = map.addGroundOverlay(groundOverlayOptions);
      groundOverlay.setClickable(true);
    } else {
      // create GroundOverlay in update()
      this.map = map;
    }
  }

  @Override
  public void removeFromMap(GoogleMap map) {
    if (groundOverlay != null) {
      groundOverlay.remove();
      groundOverlay = null;
    }
  }

  @Override public void setIconBitmap(Bitmap iconBitmap) {
    this.iconBitmap = iconBitmap;
  }

  @Override public void setIconBitmapDescriptor(
      BitmapDescriptor iconBitmapDescriptor) {
    this.iconBitmapDescriptor = iconBitmapDescriptor;
  }

  @Override public void update() {
    if (groundOverlay != null) {
      groundOverlay.setImage(this.iconBitmapDescriptor);
    } else if (map != null){
      groundOverlay = getGroundOverlay();
      if (groundOverlay != null) {
        groundOverlay.setClickable(true);
      }
    }
  }

  private GroundOverlay getGroundOverlay() {
    GroundOverlayOptions groundOverlayOptions = getGroundOverlayOptions();
    if (groundOverlayOptions != null) {
      return map.addGroundOverlay(groundOverlayOptions);
    }
    return null;
  }
}
