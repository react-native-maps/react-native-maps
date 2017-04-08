package com.airbnb.android.react.maps;

import android.graphics.Bitmap;
import android.util.LruCache;

/**
 * Created by Eric Kim on 2017-04-07.
 */

public class LruCacheManager {
    private LruCache<String, Bitmap> mMemoryCache;
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

        mMemoryCache = new LruCache<String, Bitmap>(cacheSize) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                // The cache size will be measured in kilobytes rather than
                // number of items.
                return bitmap.getByteCount() / 1024;
            }
        };
    }

    public void addBitmapToMemoryCache(String key, Bitmap bitmap) {
        if (getBitmapFromMemCache(key) == null) {
            mMemoryCache.put(key, bitmap);
        }
    }

    public Bitmap getBitmapFromMemCache(String key) {
        return mMemoryCache.get(key);
    }

}
