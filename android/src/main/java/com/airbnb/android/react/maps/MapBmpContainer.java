package com.airbnb.android.react.maps;

import android.graphics.Bitmap;

import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;

/**
 * Created by Eric Kim on 2017-04-10.
 */

public class MapBmpContainer
{
    private int mBmpSize;
    public BitmapDescriptor mBmpDescriptor;

    public MapBmpContainer(Bitmap bmp)
    {
        mBmpSize = bmp.getByteCount() / 1024;
        mBmpDescriptor = BitmapDescriptorFactory.fromBitmap(bmp);
    }

    public MapBmpContainer(BitmapDescriptor bmpDescriptor, int size)
    {
        mBmpSize = size;
        mBmpDescriptor = bmpDescriptor;
    }

    public int getByteCount()
    {
        return mBmpSize;
    }
}
