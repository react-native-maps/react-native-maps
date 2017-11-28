package com.airbnb.android.react.maps;

import android.graphics.Bitmap;

import com.google.android.gms.maps.model.BitmapDescriptor;

/**
 * Created by btm on 2017/11/12.
 */

public interface ISupportImageReader {

  public void setIconBitmap(Bitmap bitmap);

  public void setIconBitmapDescriptor(BitmapDescriptor bitmapDescriptor);

  public void update();
}
