package com.airbnb.android.react.maps;

import android.graphics.Bitmap;

import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;

/**
 * Created by Eric Kim on 2017-04-10.
 */

public class BitmapDescriptorContainer
{
    private int mBitmapByteCount;
    public BitmapDescriptor mBitmapDescriptor;
    public Bitmap mBitmap;

    public BitmapDescriptorContainer(Bitmap bitmap)
    {
        mBitmapByteCount = bitmap.getByteCount();
        mBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
        mBitmap = bitmap;
    }

    public int getByteCount()
    {
        return mBitmapByteCount;
    }
}
