package com.airbnb.android.react.maps;

import android.graphics.Bitmap;
import android.util.LruCache;

import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;

/**
 * Created by Eric Kim on 2017-04-07.
 */

public class LruCacheManager {
    private static final String TAG = LruCacheManager.class.getName();

    private LruCache<String, BitmapDescriptorContainer> mMemoryCache;
    private static final LruCacheManager INSTANCE = new LruCacheManager();

    public static LruCacheManager getInstance() {
        return INSTANCE;
    }

    private LruCacheManager() {
        // Get max available VM memory, exceeding this amount will throw an
        // OutOfMemory exception. Stored in kilobytes as LruCache takes an
        // int in its constructor.
        final int maxMemory = (int) (Runtime.getRuntime().maxMemory() / 1024);

        // Use 1/8th of the available memory for this memory cache.
        final int cacheSize = maxMemory / 8;

        mMemoryCache = new LruCache<String, BitmapDescriptorContainer>(cacheSize) {
            @Override
            protected int sizeOf(String key, BitmapDescriptorContainer bitmapDescriptor) {
                // The cache size will be measured in kilobytes rather than
                // number of items.
                return bitmapDescriptor.getByteCount() / 1024;
            }
        };
    }

    public BitmapDescriptor addBitmapToMemoryCache(String key, Bitmap bitmap) {
        BitmapDescriptor bitmapDescriptor = getBitmapFromMemCache(key);
        if (bitmapDescriptor == null) {
            bitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
            mMemoryCache.put(key, new BitmapDescriptorContainer(bitmapDescriptor, bitmap.getByteCount()));
        }
        return bitmapDescriptor;
    }

    public BitmapDescriptor getBitmapFromMemCache(String key) {
        BitmapDescriptorContainer bitmapDescriptorContainer = mMemoryCache.get(key);
        if(bitmapDescriptorContainer == null)
            return null;
        return bitmapDescriptorContainer.mBitmapDescriptor;
    }

}
