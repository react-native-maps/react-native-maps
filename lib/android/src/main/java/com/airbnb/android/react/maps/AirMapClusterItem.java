package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.ClusterItem;

public class AirMapClusterItem implements ClusterItem {
  private LatLng position;
  private String identifier;
  private String imageUrl = null;

  private BitmapDescriptor iconDescriptor = null;
  private int iconWidth = 100;

  public AirMapClusterItem(String id, double lat, double lng, String imageUrl) {
    this.position = new LatLng(lat, lng);
    this.identifier = id;
    this.imageUrl = imageUrl;
  }

  public AirMapClusterItem(String id, double lat, double lng, String imageUrl, int iconWidth) {
    this.position = new LatLng(lat, lng);
    this.identifier = id;
    this.imageUrl = imageUrl;
    this.iconWidth = iconWidth;
  }

  @Override
  public LatLng getPosition() {
    return position;
  }

  @Override
  public String getTitle() {
    return null;
  }

  @Override
  public String getSnippet() {
    return null;
  }

  public String getIdentifier() {
    return identifier;
  }

  public BitmapDescriptor getIconDescriptor() {
    return iconDescriptor;
  }

  public void setIconDescriptor(Bitmap bitmap) {
    this.iconDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public int getIconWidth() {
    return iconWidth;
  }
}
